const mongoose = require("mongoose");

const couponschema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    discount: {
      type: Number,
    },
    code: {
      type: String,
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponschema);

module.exports = Coupon;
