const express = require("express");
const router = express.Router();
const paneluserctrl = require("../../controllers/userCtrl");
// const authenticate = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

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

router.post("/addAdmin", paneluserctrl.addAdmin);

// forgot password
// send reset pass link to mail =================================================
router.post("/resetpassword", paneluserctrl.forgotpassword);

// reset passsword =================================================================
router.put("/resetpassword/:id/:token", paneluserctrl.resetpass);

// search =======================================
router.post("/search", paneluserctrl.search);

// ==============================================

// update profile
router.put("/updateprofile", paneluserctrl.updateProfile);
router.put(
  "/updateprofileimg",
  upload.single("image"),
  paneluserctrl.updateProfileImage
);

// admin role
router.get("/get/admin/:id", paneluserctrl.getAdminProfile);
router.get("/get/alladmins", paneluserctrl.getAllAdmins);

//get all admins with pagination
router.get("/get/admins", paneluserctrl.getAllAdminsWPage);

router.put("/edit/admin/:id", paneluserctrl.editAdmin);
router.patch("/edit/admin/:id/status", paneluserctrl.editAdminStatus);

// users
router.get("/get/users", paneluserctrl.getAllUsersWPage);
router.get("/get/allusers", paneluserctrl.getAllUsers);
router.patch("/edit/user/:id/status", paneluserctrl.editUserStatus);

module.exports = router;
