const express = require("express");
const router = express.Router();
const subscriberController = require("../../controllers/NewsLetterCTRL");

router.post("/subscribe", subscriberController.subscribe);

module.exports = router;
