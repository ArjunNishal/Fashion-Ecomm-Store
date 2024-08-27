const express = require("express");
const router = express.Router();
const contactUsController = require("../../controllers/Query&ContactusCTRL");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/newsletter/"); // You might want to change this to your desired upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `newsLetter-` + Date.now() + path.extname(file.originalname)); // Rename file with current timestamp
  },
});

const upload = multer({
  storage: storage,
});

router.get("/get/all/contact-us", contactUsController.getAllContactUs);

router.put("/edit/contact-us/:id", contactUsController.editContactUsStatus);

// query ======================================================
router.get("/get/queries", contactUsController.getAllQueries);

router.put("/edit/queries/:id", contactUsController.editQueryStatus);

router.post(
  "/send/newsletter",
  upload.array("images"),
  contactUsController.sendNewsletter
);

router.get('/getnewsletters', contactUsController.getAllNewsletters);

module.exports = router;
