const express = require("express");
const router = express.Router();
const { AuthController } = require("../app/controllers/index");
const { auth, isAdmin } = require("../app/middlewares/auth");

router.get("/login", AuthController.showLogin);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", auth, AuthController.me);
router.post("/logout", auth, AuthController.logout);

module.exports = router;
