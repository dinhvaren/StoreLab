const express = require("express");
const router = express.Router();
const AuthController = require("../app/controllers/AuthController");

// Register
router.post("/register", (req, res) => AuthController.register(req, res));

// Login
router.post("/login", (req, res) => AuthController.login(req, res));

// Lấy thông tin user từ token
router.get("/me", (req, res) => AuthController.me(req, res));

// Logout
router.post("/logout", (req, res) => AuthController.logout(req, res));

module.exports = router;
