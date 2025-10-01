const { User } = require("../models");

class AdminController {
  // [GET] /admin/users
  async listUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      console.error("List users error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // [GET] /admin/users/:id
  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      console.error("Get user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // [POST] /admin/users
  async createUser(req, res) {
    try {
      const { username, email, password, role } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const newUser = new User({
        username,
        email,
        password, // ⚠️ demo lab, có thể để plain hoặc hash tuỳ mục đích
        role: role || "user",
      });

      await newUser.save();
      res.status(201).json({ message: "User created", user: newUser });
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // [PUT] /admin/users/:id
  async updateUser(req, res) {
    try {
      const { username, email, role } = req.body;

      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { username, email, role },
        { new: true }
      ).select("-password");

      if (!updated) return res.status(404).json({ message: "User not found" });

      res.json({ message: "User updated", user: updated });
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // [DELETE] /admin/users/:id
  async deleteUser(req, res) {
    try {
      const deleted = await User.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "User not found" });

      res.json({ message: "User deleted" });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new AdminController();
