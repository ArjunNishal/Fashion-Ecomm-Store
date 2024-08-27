const express = require("express");
const router = express.Router();
const {
  createOrder,
  editOrderStatus,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  getOrderByIdAndUserId,
  updatePaymentStatus,
  sendPaymentFailed,
} = require("../../controllers/OrderCtrls");

// Create an order
router.post("/createorder", createOrder);

// Get order by ID
router.get("/getorder/:id", getOrderById);

router.put("/updatePaymentStatus/:id", updatePaymentStatus);

router.post("/sendpaymentFailed/:id", sendPaymentFailed);

module.exports = router;
