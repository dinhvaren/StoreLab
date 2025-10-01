const express = require("express");
const router = express.Router();
const { HomeController } = require("../app/controllers/index");
const { auth } = require("../app/middlewares/auth");

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "src/views" });
});

router.get("/dashboard", HomeController.dashboard);
router.get("/product-view.html", (req, res) => {
  res.sendFile("product-view.html", { root: "src/views" });
});

router.get("/api/products", auth, HomeController.getProducts);

module.exports = router;
