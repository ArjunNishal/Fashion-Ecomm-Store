const nodemailer = require("nodemailer");
const { constants } = require("../constants");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: constants.adminEmail,
    pass: constants.adminPass,
  },
});

module.exports = {
  transporter,
};
