const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UsersController {
  // [GET] /users/:id
  async showUsers(req, res) {
    try {
      const token = req.cookies.token;
      let currentUser = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          currentUser = await User.findById(decoded.id).lean();
        } catch (err) {
          console.warn("Token lỗi hoặc hết hạn:", err.message);
        }
      }

      if (!currentUser) {
        return res.redirect("/auth/login");
      }

      const targetId = req.params.id;
      const targetUser = await User.findById(targetId).lean();

      if (!targetUser) {
        return res.status(404).render("home/users", {
          title: "User Not Found",
          user: currentUser,
          error: "Không tìm thấy người dùng.",
        });
      }

      const isOwner = targetUser._id.toString() === currentUser._id.toString();

      if (!isOwner) {
        return res.render("home/users", {
          title: "Profile",
          user: currentUser,
          profile: targetUser,
          warning: "⚠️ Bạn đang xem hồ sơ người khác!",
          flag: process.env.BAC_USERS_FLAG,
        });
      }

      res.render("home/users", {
        title: "My Profile",
        user: currentUser,
        profile: targetUser,
        warning: null,
        flag: null,
      });
    } catch (err) {
      console.error("Lỗi showUsers:", err);
      res.status(500).send("Server error khi hiển thị thông tin người dùng");
    }
  }
}

module.exports = new UsersController();