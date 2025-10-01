const { Order, Product } = require("../models");

class OrderController {
  // [GET] /orders
  async list(req, res) {
    try {
      const orders = await Order.find({ userId: req.user.id })
        .populate("items.productId", "title price")
        .sort({ createdAt: -1 });

      res.json({ success: true, orders });
    } catch (err) {
      console.error("List orders error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // [POST] /orders
  async create(req, res) {
    try {
      const { items } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items in order" });
      }

      let total = 0;
      let flagValue = null;

      for (let i of items) {
        const product = await Product.findById(i.productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        total += product.price * (i.quantity || 1);

        if (product.isFlag && product.flagValue) {
          flagValue = product.flagValue;
        }
      }

      const order = new Order({
        userId: req.user.id,
        items,
        total,
        status: "Completed",
      });

      await order.save();

      if (flagValue) {
        return res.json({
          success: true,
          message: "Order created (flag item)",
          orderId: order._id,
          flag: flagValue, 
        });
      }

      res.status(201).json({ success: true, message: "Order created", order });
    } catch (err) {
      console.error("Create order error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // [GET] /orders/:id
  async detail(req, res) {
    try {
      const order = await Order.findById(req.params.id)
        .populate("items.productId", "title price");

      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json({ success: true, order });
    } catch (err) {
      console.error("Order detail error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // [DELETE] /orders/:id
  async cancel(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (order.status !== "Pending") {
        return res.status(400).json({ message: "Only pending orders can be cancelled" });
      }

      await order.remove();
      res.json({ success: true, message: "Order cancelled" });
    } catch (err) {
      console.error("Cancel order error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new OrderController();
