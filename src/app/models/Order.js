const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    orderId: { type: Number, unique: true },
    userId: { type: Number, ref: "User", required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],

    total: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });
orderSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "_id" });

module.exports = mongoose.model("Order", orderSchema);
