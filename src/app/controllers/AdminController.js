const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const { create } = require("../models/User");
require("dotenv").config();

class AdminController {
  // [GET] /admin
  async dashboard(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/auth/login");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id).lean();

      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).render("error/403", {
          title: "Forbidden",
          message: "Bạn không có quyền truy cập trang admin!",
        });
      }

      const users = await User.find().lean();

      res.render("home/admin", {
        title: "Admin — Manage Users",
        user: currentUser,
        users,
      });
    } catch (err) {
      console.error("Lỗi dashboard admin:", err);
      res.status(500).render("error/500", {
        title: "Server Error",
        message: "Không thể tải trang quản trị.",
      });
    }
  }

  // [PUT] /admin/users/:id
  async editUser(req, res) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await User.findById(decoded.id);

      if (!admin || admin.role !== "admin")
        return res.status(403).json({ message: "Bạn không có quyền." });

      const { username, email, role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { username, email, role },
        { new: true }
      );

      res.json({
        success: true,
        message: "Cập nhật thành công!",
        user,
      });
    } catch (err) {
      console.error("Lỗi editUser:", err);
      res.status(500).json({ message: "Server error khi cập nhật user" });
    }
  }

  // [DELETE] /admin/users/:id
  async deleteUser(req, res) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await User.findById(decoded.id);

      if (!admin || admin.role !== "admin")
        return res.status(403).json({ message: "Bạn không có quyền." });

      await User.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Đã xoá user thành công" });
    } catch (err) {
      console.error("Lỗi deleteUser:", err);
      res.status(500).json({ message: "Server error khi xoá user" });
    }
  }

// [POST] /admin/users
  async createUser(req, res) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await User.findById(decoded.id);

      if (!admin || admin.role !== "admin")
        return res.status(403).json({ message: "Bạn không có quyền." });

      const { username, email, role, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });

      const exist = await User.findOne({ $or: [{ username }, { email }] });
      if (exist) return res.status(409).json({ message: "User đã tồn tại." });

      const newUser = new User({ username, email, password, role });
      await newUser.save();

      res.json({ success: true, message: "Tạo user mới thành công!", newUser });
    } catch (err) {
      console.error("Lỗi createUser:", err);
      res.status(500).json({ message: "Server error khi tạo user" });
    }
  }
}

module.exports = new AdminController();
