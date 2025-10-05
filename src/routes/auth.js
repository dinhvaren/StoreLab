const { AuthController } = require("../app/controllers/index");
const express = require("express");
const router = express.Router();

router.get("/login", AuthController.showLogin); 
router.post("/login", AuthController.login); 
router.post("/register", AuthController.register);
router.get("/logout", AuthController.logout);

module.exports = router;