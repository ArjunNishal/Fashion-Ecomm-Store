const mongoose = require("mongoose");
const contactus_Schema = new mongoose.Schema(
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
const ContactUs = mongoose.model("ContactUs", contactus_Schema);
module.exports = ContactUs;
