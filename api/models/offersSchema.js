const mongoose = require("mongoose");

const offerschema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    number: {
      type: Number,
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerschema);

module.exports = Offer;
