const Lor = require("../models/Lor");
const generateLorId = require("../utils/generateLorId");
const formatDate = require("../utils/formatDate");
const slugify = require("../utils/slugify");
const generateLorPdf = require("../services/generateLorPdf");
const { uploadPdfBuffer, deletePdf } = require("../services/cloudinaryUpload");

const performanceOptions = ["Excellent", "Very Good", "Good", "Satisfactory"];
const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBaseUrl = (req) => {
  const envBaseUrl = String(process.env.BASE_URL || "").trim();
  if (envBaseUrl) return envBaseUrl.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
};

const validateLorPayload = (body = {}) => {
  const requiredFields = [
    "studentName",
    "studentEmail",
    "internshipDomain",
    "startDate",
    "endDate",
    "durationText",
    "projectName",
    "performance",
    "authorizedPersonName",
    "authorizedPersonDesignation",
  ];

  const missingFields = requiredFields.filter(
    (field) => !String(body[field] || "").trim()
  );

  if (missingFields.length) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  if (!performanceOptions.includes(String(body.performance || "").trim())) {
    return "Invalid performance value.";
  }

  return "";
};

exports.renderNewLor = (req, res) => {
  res.render("lor/new", {
    title: "Create LOR",
    performanceOptions,
  });
};

exports.createLor = async (req, res) => {
  const validationError = validateLorPayload(req.body);

  if (validationError) {
    req.flash("error", validationError);
    return res.redirect("/admin/lor/new");
  }

  const skills = String(req.body.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  let lorId = generateLorId();
  let existingLor = await Lor.findOne({ lorId }).select("_id");

  while (existingLor) {
    lorId = generateLorId();
    existingLor = await Lor.findOne({ lorId }).select("_id");
  }

  const baseUrl = buildBaseUrl(req);
  const verificationUrl = `${baseUrl}/verify-lor/${lorId}`;

  let lor;

  try {
    lor = await Lor.create({
      lorId,
      studentName: req.body.studentName,
      studentEmail: req.body.studentEmail,
      internshipDomain: req.body.internshipDomain,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      durationText: req.body.durationText,
      projectName: req.body.projectName,
      skills,
      performance: req.body.performance,
      recommendationText: req.body.recommendationText,
      issueDate: req.body.issueDate || new Date(),
      authorizedPersonName: req.body.authorizedPersonName,
      authorizedPersonDesignation: req.body.authorizedPersonDesignation,
      verificationUrl,
      createdBy: req.session.admin?._id || null,
    });

    const pdfBuffer = await generateLorPdf(lor);
    const publicId = `${lor.lorId}-${slugify(lor.studentName || "student")}`;
    const uploadResult = await uploadPdfBuffer(pdfBuffer, { publicId });

    lor.pdfUrl = uploadResult.secure_url;
    lor.pdfPublicId = uploadResult.public_id;
    lor.qrCodeData = verificationUrl;
    await lor.save();

    req.flash("success", "LOR generated and uploaded successfully.");
    return res.redirect(`/admin/lor/${lor._id}`);
  } catch (error) {
    console.error("CREATE LOR PDF ERROR:", error);

    if (lor?._id) {
      await Lor.findByIdAndDelete(lor._id);
    }

    req.flash(
      "error",
      "Failed to generate the LOR PDF. Please check configuration and try again."
    );
    return res.redirect("/admin/lor/new");
  }
};

exports.renderAllLors = async (req, res) => {
  const search = String(req.query.search || "").trim();
  const query = {};

  if (search) {
    const safeSearch = escapeRegex(search);
    query.$or = [
      { lorId: { $regex: safeSearch, $options: "i" } },
      { studentName: { $regex: safeSearch, $options: "i" } },
      { studentEmail: { $regex: safeSearch, $options: "i" } },
      { internshipDomain: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const lors = await Lor.find(query).sort({ createdAt: -1 }).limit(100);

  res.render("lor/all", {
    title: "All LORs",
    lors,
    search,
    formatDate,
  });
};

exports.renderLorDetails = async (req, res) => {
  const lor = await Lor.findById(req.params.id);

  if (!lor) {
    req.flash("error", "LOR record not found.");
    return res.redirect("/admin/lor/all");
  }

  res.render("lor/show", {
    title: "LOR Details",
    lor,
    formatDate,
  });
};

exports.deleteLor = async (req, res) => {
  const lor = await Lor.findByIdAndDelete(req.params.id);

  if (!lor) {
    req.flash("error", "LOR record not found.");
    return res.redirect("/admin/lor/all");
  }

  if (lor.pdfPublicId) {
    try {
      await deletePdf(lor.pdfPublicId);
    } catch (error) {
      console.error("CLOUDINARY DELETE PDF ERROR:", error);
      req.flash(
        "error",
        "LOR deleted, but the Cloudinary PDF could not be removed automatically."
      );
      return res.redirect("/admin/lor/all");
    }
  }

  req.flash("success", "LOR record deleted successfully.");
  res.redirect("/admin/lor/all");
};

exports.revokeLor = async (req, res) => {
  const lor = await Lor.findByIdAndUpdate(
    req.params.id,
    { status: "revoked" },
    { new: true }
  );

  if (!lor) {
    req.flash("error", "LOR record not found.");
    return res.redirect("/admin/lor/all");
  }

  req.flash("success", "LOR revoked successfully.");
  res.redirect(`/admin/lor/${lor._id}`);
};

exports.previewLorPdf = async (req, res) => {
  const lor = await Lor.findById(req.params.id);

  if (!lor) {
    req.flash("error", "LOR record not found.");
    return res.redirect("/admin/lor/all");
  }

  const pdfBuffer = await generateLorPdf(lor);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${lor.lorId || "lor"}.pdf"`
  );
  return res.send(pdfBuffer);
};
