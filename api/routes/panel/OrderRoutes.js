const express = require("express");
const router = express.Router();
const {
  createOrder,
  editOrderStatus,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  getOrderByIdAndUserId,
} = require("../../controllers/OrderCtrls");

// Edit order status
router.put("/edit-status", editOrderStatus);

// Get order by ID
router.get("/getorder/:id", getOrderById);

// Get all orders
router.get("/getallorders", getAllOrders);

module.exports = router;
