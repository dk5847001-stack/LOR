const express = require("express");
const router = express.Router();

const publicController = require("../controllers/publicController");
const asyncWrap = require("../middlewares/asyncWrap");

router.get("/", publicController.renderHome);
router.get("/verify-lor", (req, res) => {
  const lorId = String(req.query.lorId || "").trim();
  if (!lorId) {
    req.flash("error", "Please enter a LOR ID.");
    return res.redirect("/");
  }
  return res.redirect(`/verify-lor/${encodeURIComponent(lorId)}`);
});
router.get("/verify-lor/:lorId", asyncWrap(publicController.verifyLor));

module.exports = router;
