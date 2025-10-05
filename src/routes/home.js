const { HomeController, OdersController, UsersController } = require("../app/controllers/index");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.redirect("/auth/login"));
router.get("/dashboard", HomeController.dashboard);
router.post("/buy/:id", HomeController.buyProduct);
router.get("/view/product", HomeController.viewProduct);
router.get("/orders", OdersController.showOrders);
router.get("/view/orders/:id", OdersController.viewOrder);
router.get("/users/:id", UsersController.showUsers);

module.exports = router;
