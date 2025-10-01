const express = require("express");
const router = express.Router();
const { HomeController }  = require("../app/controllers/index");
const { auth } = require("../app/middlewares/auth");

router.get("/", auth, HomeController.dashboard);

module.exports = router;
