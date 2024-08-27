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
} = require("../../../controllers/OrderCtrls");

// Create an order
router.post("/createorder", createOrder);

router.get("/getorder/:id", getOrderById);

router.get("/getorders/user/:userId", getOrdersByUserId);

router.get("/:id/user/:userId", getOrderByIdAndUserId);

router.put("/updatePaymentStatus/:id", updatePaymentStatus);

module.exports = router;
