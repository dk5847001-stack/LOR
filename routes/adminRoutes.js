const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const asyncWrap = require("../middlewares/asyncWrap");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

router.use(isLoggedIn, isAdmin);

router.get("/dashboard", asyncWrap(adminController.renderDashboard));

module.exports = router;
