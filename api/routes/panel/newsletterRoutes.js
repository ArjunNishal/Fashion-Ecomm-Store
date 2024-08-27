const express = require("express");
const router = express.Router();
const subscriberController = require("../../controllers/NewsLetterCTRL");

router.put(
  "/edit/subscribe/:email",
  subscriberController.updateSubscriptionStatus
);

router.get("/get/subscribers", subscriberController.getAllSubscribers);

module.exports = router;
