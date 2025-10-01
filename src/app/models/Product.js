const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: String, enum: ["In stock", "Low stock", "Preorder"], default: "In stock" },
  imageUrl: { type: String },
  isFlag: { type: Boolean, default: false },     // <-- thêm
  flagValue: { type: String, default: null },    // <-- thêm, lưu flag nếu isFlag true
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
