const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/webloginCtrl");
const webUserCtrl = require("../../controllers/webUserCtrl");

router.post("/signup", loginController.registerUser);
router.post("/login", loginController.loginUser);

// send reset pass link to mail =================================================
router.post("/resetpassword", webUserCtrl.forgotpassword);

// reset passsword =================================================================
router.put("/resetpassword/:id/:token", webUserCtrl.resetpass);

module.exports = router;
