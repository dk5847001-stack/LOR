const Lor = require("../models/Lor");
const formatDate = require("../utils/formatDate");

exports.renderHome = (req, res) => {
  res.render("public/home", {
    title: "InternovaTech LOR",
  });
};

exports.verifyLor = async (req, res) => {
  const lor = await Lor.findOne({
    lorId: String(req.params.lorId || "").trim(),
  });

  res.render("public/verify", {
    title: "Verify LOR",
    lor,
    searchedLorId: req.params.lorId,
    formatDate,
  });
};
