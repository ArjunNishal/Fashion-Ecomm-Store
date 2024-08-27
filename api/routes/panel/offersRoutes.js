const express = require("express");
const router = express.Router();
const offerController = require("../../controllers/offerCtrls");

router.get("/get/offers", offerController.getOffers);

router.post("/add/offers", offerController.addOffer);

router.delete("/delete/offer/:id", offerController.deleteOffer);

router.get("/get/coupons", offerController.getCoupons);

// Add a new coupon
router.post("/add/coupon", offerController.addCoupon);

// Delete a coupon
router.delete("/delete/coupon/:id", offerController.deleteCoupon);

module.exports = router;
