const { Product, User, Order } = require("../models/index");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class HomeController {
  // [GET] /dashboard
  async dashboard(req, res) {
    try {
      const token = req.cookies.token;
      let user = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(decoded.id).lean();
        } catch (err) {
          console.warn("Token không hợp lệ hoặc hết hạn:", err.message);
        }
      }

      if (!user) {
        return res.render("error/401", { page: { title: "Unauthorized" } });
      }

      const products = await Product.find().limit(8);
      res.render("home/dashboard", {
        page: { title: "Trang chủ" },
        products,
        user,
      });
    } catch (err) {
      console.error("Lỗi load sản phẩm:", err);
      res.render("error/500", { page: { title: "Internal Server Error" } });
    }
  }

  // [POST] /buy/:id
  async buyProduct(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      const product = await Product.findById(req.params.id);

      if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      if (user.balance < product.price)
        return res.status(400).json({ message: "Không đủ tiền trong tài khoản" });

      user.balance -= product.price;
      await user.save();

      const order = new Order({
        userId: user._id,
        items: [{ productId: product._id, quantity: 1 }],
        total: product.price,
        status: "Completed",
      });
      await order.save();

      if (product.isFlag && product.flagValue) {
        return res.json({
          success: true,
          message: `Mua thành công sản phẩm "${product.title}"`,
          flag: product.flagValue,
        });
      }

      res.json({ success: true, message: `Mua thành công sản phẩm "${product.title}"` });
    } catch (err) {
      console.error("Lỗi khi mua hàng:", err);
      res.status(500).json({ message: "Lỗi server khi xử lý mua hàng" });
    }
  }

  // [GET] /view/product?url=...
  async viewProduct(req, res) {
    try {
      const { url } = req.query;

      if (!url) {
        return res.render("home/product-view", {
          title: "View Product",
          result: null,
          error: null,
        });
      }

      const response = await axios.get(url, { timeout: 5000 });
      const content = response.data;

      if (
        url.includes("127.0.0.1") ||
        url.includes("localhost") ||
        url.includes("metadata.google") ||
        url.includes("169.254.169.254")
      ) {
        return res.send(`
          <h3>✅ Internal Resource Accessed!</h3>
          <p><b>Flag:</b> ${process.env.SSRF_FLAG}</p>
        `);
      }

      return res.render("home/product-view", {
        title: "View Product",
        result: content.slice(0, 300) + "...",
        error: null,
      });
    } catch (err) {
      console.error("SSRF Error:", err.message);
      return res.render("home/product-view", {
        title: "View Product",
        result: null,
        error: "❌ Request failed or invalid URL",
      });
    }
  }
}

module.exports = new HomeController();
