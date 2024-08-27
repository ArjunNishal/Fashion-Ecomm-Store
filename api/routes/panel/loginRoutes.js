const express = require("express");
const router = express.Router();
const admincontroller = require("../../controllers/userCtrl");
// const authenticate = require("../middlewares/auth");

router.post("/login", admincontroller.AdminLogin);

router.post("/resetpassword", admincontroller.forgotpassword);

// reset passsword =================================================================
router.put("/resetpassword/:id/:token", admincontroller.resetpass);

module.exports = router;
