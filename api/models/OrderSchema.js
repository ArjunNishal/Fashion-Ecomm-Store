const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    address: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postcode: {
        type: String,
      },
    },
    mobileno: {
      type: String,
    },
    email: {
      type: String,
    },
    orderNotes: {
      type: String,
    },
    items: {
      type: Array,
    },
    deliverydetails: {
      type: String,
    },
    ordertotal: {
      type: String,
    },
    orderstatus: {
      type: String,
      enum: [
        "order_placed",
        "packed",
        "confirmed",
        "out_for_delivery",
        "delivered",
        "payment_pending",
      ],
      default: "payment_pending",
    },
    paymentStatus: {
      type: Boolean,

      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
