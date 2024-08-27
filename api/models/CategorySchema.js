const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    offer: { type: String },
    image: {
      type: String,
    },
    status: {
      type: Number,
      default: 1, // Assuming 1 is for active by default
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    featureCategory: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
