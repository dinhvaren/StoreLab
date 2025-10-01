const express = require("express");
const router = express.Router();
const OrderController = require("../app/controllers/OrderController");
const { auth } = require("../app/middlewares/auth");

router.get("/", auth, OrderController.list);
router.post("/", auth, OrderController.create);
router.get("/:id", auth, OrderController.detail);
router.delete("/:id", auth, OrderController.cancel);

module.exports = router;
