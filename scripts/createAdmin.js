require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const createAdmin = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is required.");
  }

  const name = String(process.env.ADMIN_NAME || "InternovaTech Admin").trim();
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email || !password || password.length < 8) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD with 8+ characters are required.");
  }

  await mongoose.connect(process.env.MONGO_URL);

  const existingAdmin = await Admin.findOne({ email }).select("+password");

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.password = password;
    existingAdmin.role = "admin";
    existingAdmin.isActive = true;
    await existingAdmin.save();
    console.log(`Admin updated: ${email}`);
  } else {
    await Admin.create({
      name,
      email,
      password,
      role: "admin",
    });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
};

createAdmin()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Create admin failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
