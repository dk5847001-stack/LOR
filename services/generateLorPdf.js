const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const QRCode = require("qrcode");

const formatDate = require("../utils/formatDate");

const getAssetDataUrl = (fileName) => {
  const filePath = path.join(__dirname, "..", "public", "images", fileName);
  const buffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
};

const buildDefaultRecommendation = (lor) => {
  const skillsText = Array.isArray(lor.skills) && lor.skills.length
    ? ` The candidate demonstrated practical ability in ${lor.skills.join(", ")}.`
    : "";

  return `During the internship with InternovaTech, ${lor.studentName} worked in the ${lor.internshipDomain} domain and contributed to the project titled "${lor.projectName}". The candidate showed a sincere learning attitude, professional conduct, and consistent commitment throughout the internship period.${skillsText} Based on the performance observed, we are pleased to recommend ${lor.studentName} for future academic and professional opportunities.`;
};

module.exports = async (lor) => {
  let browser;

  try {
    const verificationUrl = lor.verificationUrl;
    const qrCodeData = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 220,
    });

    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "pdf",
      "lorTemplate.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      lor,
      qrCodeData,
      logoData: getAssetDataUrl("logo.png"),
      signatureData: getAssetDataUrl("signature.png"),
      sealData: getAssetDataUrl("seal.png"),
      formatDate,
      skillsText: Array.isArray(lor.skills) ? lor.skills.join(", ") : "",
      letterBody:
        String(lor.recommendationText || "").trim() ||
        buildDefaultRecommendation(lor),
    });

    const launchOptions = {
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
    };

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.setContent(html, {
      waitUntil: "load",
      timeout: 0,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
