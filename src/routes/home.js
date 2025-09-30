const express = require("express");
const router = express.Router();
const { HomeController } = require("../app/controllers");

router.get("/", HomeController.dashboard);

module.exports = router;
