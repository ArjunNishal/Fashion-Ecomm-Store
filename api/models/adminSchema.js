const mongoose = require("mongoose");
const adminDetails_schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    username: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobileno: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "admin",
    },
    status: {
      type: Number,
      default: 1,
    },
    permissions: {
      type: Array,
    },
    image: {
      type: String,
      //   default: "user-vector.png",
    },
  },
  {
    timestamps: true,
  }
);
const Admin = mongoose.model("Admin", adminDetails_schema);
module.exports = Admin;
