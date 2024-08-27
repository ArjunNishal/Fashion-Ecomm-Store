const express = require("express");
const router = express.Router();
const cartCtrl = require("../../controllers/cartCtrl");

// Add item
router.post("/add/item", cartCtrl.addItem);

// Increase item quantity
router.post("/inc/item", cartCtrl.increaseItemQuantity);

// Decrease item quantity
router.post("/dec/item", cartCtrl.decreaseItemQuantity);

// Remove item
router.post("/remove/item", cartCtrl.removeItem);

// Clear cart
router.post("/remove/all", cartCtrl.clearCart);

router.post("/get/details", cartCtrl.getCart);

module.exports = router;
