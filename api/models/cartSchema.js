const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    color: [
      {
        id: { type: String },
        colorId: { type: String },
        name: { type: String },
        code: { type: String },
      },
    ],
    size: [
      {
        id: { type: String },
        sizeId: { type: String },
        shortform: {
          type: String,
        },
        fullform: {
          type: String,
        },
      },
    ],
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    items: [itemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
