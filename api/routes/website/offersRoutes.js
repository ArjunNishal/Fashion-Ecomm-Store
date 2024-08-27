const express = require("express");
const router = express.Router();
const offerController = require("../../controllers/offerCtrls");

router.get("/get/offers", offerController.getOffers);

router.get("/get/coupon/:code", offerController.getCouponByCode);

module.exports = router;
