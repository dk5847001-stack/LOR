module.exports = (req, res, next) => {
  if (!req.session.admin || req.session.admin.role !== "admin") {
    req.flash("error", "Admin access required.");
    return res.redirect("/login");
  }

  next();
};
