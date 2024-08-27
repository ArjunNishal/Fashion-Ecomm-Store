const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
    },
    subheading: {
      type: String,
    },
    subject: {
      type: String,
    },
    btntext: {
      type: String,
    },
    btnurl: {
      type: String,
    },
    btmheading: {
      type: String,
    },
    btmsubheading: {
      type: String,
    },
    selectedproducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    images: {
      type: Array,
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;
