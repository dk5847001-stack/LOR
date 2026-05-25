const express = require("express");
const router = express.Router();

const lorController = require("../controllers/lorController");
const asyncWrap = require("../middlewares/asyncWrap");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

router.use(isLoggedIn, isAdmin);

router.get("/new", lorController.renderNewLor);
router.post("/generate", asyncWrap(lorController.createLor));
router.get("/all", asyncWrap(lorController.renderAllLors));
router.get("/:id/preview-pdf", asyncWrap(lorController.previewLorPdf));
router.get("/:id", asyncWrap(lorController.renderLorDetails));
router.delete("/:id/delete", asyncWrap(lorController.deleteLor));
router.patch("/:id/revoke", asyncWrap(lorController.revokeLor));

module.exports = router;
