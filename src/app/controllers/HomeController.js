const { Product } = require("../models");

class HomeController {
  // [GET] /dashboard (render file HTML tĩnh)
  async dashboard(req, res, next) {
    try {
      res.sendFile("dashboard.html", { root: "src/views" });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).sendFile("500.html", { root: "src/views" });
    }
  }

  // [GET] /api/products
  async getProducts(req, res, next) {
    try {
      const products = await Product.find().limit(10);
      res.json({
        message: "Products fetched",
        total: products.length,
        products,
      });
    } catch (err) {
      console.error("API products error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new HomeController();
