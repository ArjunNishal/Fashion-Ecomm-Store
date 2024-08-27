const mongoose = require("mongoose");
const query_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobileno: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
    updatedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);
const Query = mongoose.model("Query", query_Schema);
module.exports = Query;
