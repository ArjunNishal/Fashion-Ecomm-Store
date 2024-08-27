const express = require("express");
const router = express.Router();
const contactUsController = require("../../controllers/Query&ContactusCTRL");

router.post("/add/contact-us", contactUsController.addContactUs);

router.post("/add/queries", contactUsController.addQuery);

module.exports = router;
