const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  code: {
    type: String,
  },
});

const sizeSchema = new mongoose.Schema({
  shortform: {
    type: String,
  },
  fullform: {
    type: String,
  },
});

const productDetailsSchema = new mongoose.Schema({
  productName: {
    type: String,
  },
  sizes: [sizeSchema],
  colors: [colorSchema],
});

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    actualPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    note: {
      type: String,
    },
    description: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    images: {
      type: [String],
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    reviews: [reviewSchema],
    type: {
      type: String,
      enum: ["single", "combo"],
      default: "single",
    },
    products: [productDetailsSchema],
    status: {
      type: Number,
      enum: [1, 2, 0],
      default: 1,
    },
    featureProduct: {
      type: Number,
      enum: [1, 0],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
