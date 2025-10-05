const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
require("dotenv").config();

class AuthController {
  // [GET] /login
  showLogin(req, res) {
    if (req.cookies && req.cookies.token) {
      return res.redirect("/dashboard");
    }

    res.render("auth/index", { title: "Login", errors: null, values: {} });
  }

  // [POST] /login
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).render("auth/index", {
          title: "Login",
          errors: ["Vui lòng nhập đủ thông tin"],
          values: { username },
        });
      }

      const user = await User.findOne({ username });

      if (!user) {
        // Nếu không tìm thấy user -> render lại form với message
        return res.status(404).render("auth/index", {
          title: "Login",
          errors: ["Không tìm thấy người dùng"],
          values: { username },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).render("auth/index", {
          title: "Login",
          errors: ["Sai mật khẩu"],
          values: { username },
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const payload = {
        id: user._id,
        role: user.role,
        flag: process.env.JWT_FLAG,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      return res.redirect("/dashboard");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      return res.status(500).render("auth/index", {
        title: "Login",
        errors: ["Lỗi server, thử lại sau"],
        values: {},
      });
    }
  }

  // [POST] /register
  async register(req, res) {
    try {
      let { username, email, password } = req.body;

      username = (username || "").trim();
      email = (email || "").trim();
      password = (password || "").trim();

      const errors = [];
      if (!username || !email || !password) errors.push("Thiếu thông tin");
      if (password.length < 6) errors.push("Mật khẩu phải có ít nhất 6 ký tự");
      if (errors.length) {
        return res.status(400).render("auth/index", {
          title: "Register",
          errors,
          values: { username, email },
          form: "register",
        });
      }

      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) {
        return res.status(409).render("auth/index", {
          title: "Register",
          errors: ["Username hoặc email đã tồn tại"],
          values: { username, email },
          form: "register",
        });
      }

      const hashed = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashed });
      await newUser.save();

      return res.redirect("/auth/login?registered=1");
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      return res.status(500).render("auth/index", {
        title: "Register",
        errors: ["Lỗi server, thử lại sau"],
        values: {},
        form: "register",
      });
    }
  }

  // [GET] /logout
  logout(req, res) {
    res.clearCookie("token");
    res.redirect("/auth/login");
  }
}

module.exports = new AuthController();