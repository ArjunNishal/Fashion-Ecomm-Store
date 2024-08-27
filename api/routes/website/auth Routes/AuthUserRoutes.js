const express = require("express");
const router = express.Router();
const webUserCtrl = require("../../../controllers/webUserCtrl");
const multer = require("multer");
const path = require("path");
const paneluserctrl = require("../../../controllers/userCtrl");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/"); // You might want to change this to your desired upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `profile-` + Date.now() + path.extname(file.originalname)); // Rename file with current timestamp
  },
});

const upload = multer({
  storage: storage,
});

// send reset pass link to mail =================================================
router.post("/resetpassword", webUserCtrl.forgotpassword);

// reset passsword =================================================================
router.put("/resetpassword/:id/:token", webUserCtrl.resetpass);

router.put("/updateprofiledetails", webUserCtrl.updateUserDetails);

router.put("/upload/img", upload.single("image"), webUserCtrl.updateProfilePic);

router.get("/get/userprofile", webUserCtrl.getUserProfile);

module.exports = router;
