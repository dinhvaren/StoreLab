const { HomeController } = require("../app/controllers/index");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.redirect("/auth/login"));
router.get("/dashboard", HomeController.dashboard);

module.exports = router;
