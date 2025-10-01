const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

class AuthController {
  // [GET] /auth/login (render trang login/register)
  showLogin(req, res) {
    try {
      res.sendFile("index.html", { root: "src/views" });
    } catch (err) {
      console.error("ShowLogin error:", err);
      res.status(500).sendFile("500.html", { root: "src/views" });
    }
  }

  // [POST] /auth/register
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashed,
        role: "user",
      });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).sendFile("500.html", { root: "src/views" });
    }
  }

  // [POST] /auth/login
  async login(req, res) {
    try {
      const { loginId, password } = req.body;
      const user = await User.findOne({
        $or: [{ email: loginId }, { username: loginId }],
      });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const flag = process.env.CTF_FLAG;
      const token = jwt.sign(
        { id: user._id, role: user.role, flag },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).sendFile("500.html", { root: "src/views" });
    }
  }

  // [GET] /auth/me
  async me(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return res.status(401).json({ message: "No token" });
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      console.error("Me error:", err);
      res.status(401).sendFile("401.html", { root: "src/views" });
    }
  }

  // [POST] /auth/logout
  async logout(req, res) {
    res.json({ message: "Logout successful (client must discard token)" });
  }
}

module.exports = new AuthController();