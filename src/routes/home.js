const {HomeController} = require("../app/controllers/index");
const express = require("express");
const router = express.Router();

router.get("/dashboard", HomeController.dashboard);

module.exports = router;