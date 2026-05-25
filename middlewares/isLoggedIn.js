module.exports = (req, res, next) => {
  if (!req.session.admin) {
    req.flash("error", "Please log in to continue.");
    return res.redirect("/login");
  }

  next();
};
