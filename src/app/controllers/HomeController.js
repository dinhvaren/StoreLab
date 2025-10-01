const { Product } = require("../models");

class HomeController {
  // [GET] /dashboard
  async dashboard(req, res, next) {
    try {
      const products = await Product.find().limit(8);

      res.json({
        message: "Dashboard Store",
        total: products.length,
        products,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new HomeController();
