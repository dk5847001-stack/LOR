const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const asyncWrap = require("../middlewares/asyncWrap");

router.get("/login", authController.renderLogin);
router.post("/login", asyncWrap(authController.login));
router.get("/logout", authController.logout);

module.exports = router;
