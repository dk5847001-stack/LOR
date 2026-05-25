const Admin = require("../models/Admin");

exports.renderLogin = (req, res) => {
  if (req.session.admin) {
    return res.redirect("/admin/dashboard");
  }

  res.render("auth/login", {
    title: "Admin Login",
  });
};

exports.login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const admin = await Admin.findOne({ email, role: "admin" }).select(
    "+password name email role isActive"
  );

  if (!admin || admin.isActive === false) {
    req.flash("error", "Invalid admin email or password.");
    return res.redirect("/login");
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    req.flash("error", "Invalid admin email or password.");
    return res.redirect("/login");
  }

  req.session.admin = {
    _id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };

  req.flash("success", "Logged in successfully.");
  res.redirect("/admin/dashboard");
};

exports.logout = (req, res) => {
  req.session.admin = null;
  req.flash("success", "Logged out successfully.");
  res.redirect("/");
};
