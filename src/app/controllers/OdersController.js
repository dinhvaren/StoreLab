const { Order, Product, User } = require("../models/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class OrderController {
  // [GET] /orders
  async showOrders(req, res) {
    try {
      const token = req.cookies.token;
      let user = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(decoded.id).lean();
        } catch (err) {
          console.warn("Invalid token:", err.message);
        }
      }

      if (!user) return res.redirect("/auth/login");

      const orders = await Order.find({ userId: user._id })
        .populate("items.productId")
        .sort({ createdAt: -1 })
        .lean();

      res.render("home/orders", {
        title: "My Orders",
        user,
        orders,
      });
    } catch (err) {
      console.error("Lỗi showOrders:", err);
      res.status(500).send("Server error khi load orders");
    }
  }

  // [GET] /view/orders/:id
  async viewOrder(req, res) {
    try {
      const { id } = req.params;
      const token = req.cookies.token;
      let user = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(decoded.id).lean();
        } catch (err) {
          console.warn("Invalid token:", err.message);
        }
      }

      if (!user) return res.redirect("/auth/login");

      const order = await Order.findById(id)
        .populate("items.productId")
        .populate("userId")
        .lean();

      if (!order) {
        return res.status(404).render("home/order-view", {
          title: "Order Not Found",
          user,
          order: null,
          error: "Không tìm thấy đơn hàng.",
        });
      }

      const isOwner = order.userId._id.toString() === user._id.toString();

      if (!isOwner) {
        return res.render("home/order-view", {
          title: "Order Detail",
          user,
          order,
          warning: "⚠️ Bạn không có quyền xem đơn hàng này!",
          flag: process.env.BAC_ORDERS_FLAG,
        });
      }

      res.render("home/order-view", {
        title: `Order #${order.orderId}`,
        user,
        order,
        warning: null,
        flag: null,
      });
    } catch (err) {
      console.error("Lỗi viewOrder:", err);
      res.status(500).send("Server error khi xem chi tiết đơn hàng");
    }
  }
}

module.exports = new OrderController();
