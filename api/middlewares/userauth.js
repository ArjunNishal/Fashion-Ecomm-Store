const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const userauth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token, req.headers, "token auth page");
  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Access token is missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({
        status: false,
        message: "You do not have user privileges or user not exists",
      });
    }

    if (user.status !== 1) {
      return res.status(403).json({
        status: false,
        message: "Your profile is blocked or deactivated",
      });
    }

    req.user = decoded.id;
    req.detail = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ status: false, message: "Access token is missing or invalid" });
  }
};

module.exports = userauth;
