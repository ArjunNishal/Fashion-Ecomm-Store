const express = require("express");
const router = express.Router();
const productctrl = require("../../../controllers/Product.Ctrl");
const multer = require("multer");
const path = require("path");

// Route to add a review to a product
router.post("/addreview/:productId", productctrl.addReview);

// Route to edit a review of a product
router.put("/editreview/:productId/:reviewId", productctrl.editReview);

// Route to remove a review from a product
router.delete("/delete_review/:productId/:reviewId", productctrl.removeReview);

module.exports = router;
