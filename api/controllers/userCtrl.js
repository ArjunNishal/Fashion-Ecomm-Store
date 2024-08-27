const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const Admin = require("../models/adminSchema");
const { constants } = require("../constants");
const { pagination } = require("./pagination");
const { default: mongoose } = require("mongoose");
const User = require("../models/userSchema");
const fs = require("fs");
const { transporter } = require("./emailTransporter");

exports.addAdmin = async (req, res) => {
  try {
    const {
      firstName,
      username,
      lastName,
      email,
      mobileno,
      password,
      //   role,
      status,
      permissions,
    } = req.body;

    const existingAdminwemail = await Admin.findOne({
      email,
    });
    const existingAdminWmobile = await Admin.findOne({
      mobileno,
    });
    const existingAdminWusername = await Admin.findOne({
      username,
    });

    if (existingAdminwemail) {
      return res.status(409).json({
        message: "Admin with the same email already exists",
      });
    }
    if (existingAdminWmobile) {
      return res.status(409).json({
        message: "Admin with the same mobile number already exists",
      });
    }
    if (existingAdminWusername) {
      return res.status(409).json({
        message: "Admin with the same username already exists",
      });
    }

    // const passwordHash = await bcrypt.hash(password, 12);

    const data = {
      firstName,
      lastName,
      username,
      email,
      mobileno,
      password: password,
      role: "admin",
      status,
      permissions: permissions,
    };
    const admin = new Admin(data);

    const savedadmin = await admin.save();

    const superadmin = await Admin.findOne({ role: "superadmin" });

    const mailOptions = {
      from: constants.adminEmail,
      to: superadmin.email,
      subject: "New Admin Registration",
      text: `A new admin has been added to your Admin panel.\n
      The details of the admin - \n
        Username: ${savedadmin.username}\n
        password: ${savedadmin.password}\n
        email: ${savedadmin.email}\n
        mobile : ${savedadmin.mobileno}\n
      `,
      //   html: passbody,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ status: true, data: savedadmin, message: "admin created" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error while adding the admin" });
  }
};

exports.AdminLogin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).send({ message: "Not a registered admin" });
    }
    if (admin.status !== 1) {
      return res.status(500).send({
        message: "Your account is blocked, Please contact Superadmin",
      });
    }

    const isMatch = admin.password === req.body.password;
    console.log(isMatch);
    if (!isMatch)
      return res.status(500).json({ message: "Password is incorrect." });

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        mobileno: admin.mobileno,
        role: admin.role,
        email: admin.email,
        permissions: admin.permissions,
        firstname: admin.firstName,
        lastname: admin.lastName,
        image: admin?.image,
      },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).send({
      data: { admin, token },
      status: true,
      message: "Logged in successfully",
    });
  } catch (e) {
    res.status(500).send({ status: false, data: e, message: "Login failed" });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Admin.findOne({ email });
    console.log(email, user);
    if (!user) {
      return res
        .status(500)
        .send({ status: false, message: "We cannot find your email." });
    } else {
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ email: user.email, id: user.id }, secret, {
        expiresIn: "5m",
      });
      //   const link = `${constants.renderUrl}api/user/resetpassword/${user.id}/${token}`;
      const link2 = `${constants.frontUrl}resetpassword_panel?id=${user.id}&token=${token}`;
      // console.log(link, link2, "================= link ============= ");
      // save the token in the database along with the user id and an expiration date
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // send the password reset email

      let passbody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i&display=swap"
      rel="stylesheet"
    />
    <!--<![endif]-->
    <title>Email Template</title>
    <!--[if gte mso 9]>
      <style type="text/css" media="all">
        sup {
          font-size: 100% !important;
        }
      </style>
    <![endif]-->
    <!-- body, html, table, thead, tbody, tr, td, div, a, span { font-family: Arial, sans-serif !important; } -->

    <style type="text/css" media="screen">
      body {
        padding: 0 !important;
        margin: 0 auto !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        background: #f4ecfa;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #ff3f3f;
        text-decoration: none;
      }
      p {
        padding: 0 !important;
        margin: 0 !important;
      }
      img {
        margin: 0 !important;
        -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      .btn-16 a {
        display: block;
        padding: 15px 35px;
        text-decoration: none;
      }
      .btn-20 a {
        display: block;
        padding: 15px 35px;
        text-decoration: none;
      }

      .l-white a {
        color: #ffffff;
      }
      .l-black a {
        color: #282828;
      }
      .l-pink a {
        color: #ff3f3f;
      }
      .l-grey a {
        color: #6e6e6e;
      }
      .l-purple a {
        color: #9128df;
      }

      .gradient {
        /* background: linear-gradient(90deg, #5170ff, #ff66c4); */
        background: #ff3f3f;
      }

      .btn-secondary {
        border-radius: 10px;
        background: linear-gradient(90deg, #5170ff, #ff66c4);
      }

      /* Mobile styles */
      @media only screen and (max-device-width: 480px),
        only screen and (max-width: 480px) {
        .mpx-10 {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .mpx-15 {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        u + .body .gwfw {
          width: 100% !important;
          width: 100vw !important;
        }

        .td,
        .m-shell {
          width: 100% !important;
          min-width: 100% !important;
        }

        .mt-left {
          text-align: left !important;
        }
        .mt-center {
          text-align: center !important;
        }
        .mt-right {
          text-align: right !important;
        }

        .me-left {
          margin-right: auto !important;
        }
        .me-center {
          margin: 0 auto !important;
        }
        .me-right {
          margin-left: auto !important;
        }

        .mh-auto {
          height: auto !important;
        }
        .mw-auto {
          width: auto !important;
        }

        .fluid-img img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }

        .column,
        .column-top,
        .column-dir-top {
          float: left !important;
          width: 100% !important;
          display: block !important;
        }

        .m-hide {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          font-size: 0 !important;
          line-height: 0 !important;
          min-height: 0 !important;
        }
        .m-block {
          display: block !important;
        }

        .mw-15 {
          width: 15px !important;
        }

        .mw-2p {
          width: 2% !important;
        }
        .mw-32p {
          width: 32% !important;
        }
        .mw-49p {
          width: 49% !important;
        }
        .mw-50p {
          width: 50% !important;
        }
        .mw-100p {
          width: 100% !important;
        }

        .mmt-0 {
          margin-top: 0 !important;
        }
      }
    </style>
  </head>
  <body
    class="body"
    style="
      padding: 0 !important;
      margin: 0 auto !important;
      display: block !important;
      min-width: 100% !important;
      width: 100% !important;
      background: #f4ecfa;
      -webkit-text-size-adjust: none;
    "
  >
    <center>
      <table
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="margin: 0; padding: 0; width: 100%; height: 100%"
        bgcolor="#f4ecfa"
        class="gwfw"
      >
        <tr>
          <td
            style="margin: 0; padding: 0; width: 100%; height: 100%"
            align="center"
            valign="top"
          >
            <table
              width="600"
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="m-shell"
            >
              <tr>
                <td
                  class="td"
                  style="
                    width: 600px;
                    min-width: 600px;
                    font-size: 0pt;
                    line-height: 0pt;
                    padding: 0;
                    margin: 0;
                    font-weight: normal;
                  "
                >
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                  >
                    <tr>
                      <td class="mpx-10">
                        <!-- Top -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="text-12 c-grey l-grey a-right py-20"
                              style="
                                font-size: 12px;
                                line-height: 16px;
                                font-family: 'PT Sans', Arial, sans-serif;
                                min-width: auto !important;
                                color: #6e6e6e;
                                text-align: right;
                                padding-top: 20px;
                                padding-bottom: 20px;
                              "
                            >
                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="text-decoration: none; color: #6e6e6e"
                                ></span
                              ></a>
                            </td>
                          </tr>
                        </table>
                        <!-- END Top -->

                        <!-- Container -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="gradient pt-10"
                              style="
                                border-radius: 10px 10px 0 0;
                                padding-top: 10px;
                              "
                              bgcolor="rgb(189, 50, 40)"
                            >
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    style="border-radius: 10px 10px 0 0"
                                    bgcolor="#ffffff"
                                  >
                                    <!-- Logo -->
                                    <div
                                      style="
                                        font-size: 15px;
                                        padding: 5px 50px;
                                        display: flex;
                                        gap: 10px;
                                      "
                                    >
                                      <img
                                        style="height: 35px"
                                        src="http://localhost:3000/assets/img/logo.png"
                                        alt=""
                                      />
                                      <h2>Ecom</h2>
                                    </div>
                                    <!-- Logo -->
                                    <!-- <hr> -->
                                    <!-- Main -->
                                    <table
                                      width="100%"
                                      border="0"
                                      cellspacing="0"
                                      cellpadding="0"
                                    >
                                      <tr>
                                        <td
                                          class="px-50 mpx-15"
                                          style="
                                            padding-left: 50px;
                                            padding-right: 50px;
                                          "
                                        >
                                          <!-- Section - Intro -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-50"
                                                style="padding-bottom: 50px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <!-- <tr>
                                                                <td
                                                                  class="fluid-img img-center pb-50"
                                                                  style="
                                                                    font-size: 0pt;
                                                                    line-height: 0pt;
                                                                    text-align: center;
                                                                    padding-bottom: 50px;
                                                                  "
                                                                >
                                                                  <img
                                                                    src="../images/img_intro_4.png"
                                                                    width="368"
                                                                    height="296"
                                                                    border="0"
                                                                    alt=""
                                                                  />
                                                                </td>
                                                              </tr> -->
                                                  <hr />
                                                  <tr>
                                                    <td
                                                      class="title-36 a-center pb-15"
                                                      style="
                                                        font-size: 36px;
                                                        line-height: 40px;
                                                        color: #282828;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        text-align: center;
                                                        padding-bottom: 15px;
                                                        padding-top: 15px;
                                                      "
                                                    >
                                                      <strong
                                                        >Forgot your
                                                        password?</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="text-16 lh-26 a-center pb-25"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: center;
                                                        padding-bottom: 25px;
                                                      "
                                                    >
                                                      Click on the button below
                                                      to reset your password,
                                                      you have 5 mins to pick
                                                      your password. After that,
                                                      you'll have to ask for a
                                                      new one.
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td align="center">
                                                      <!-- Button -->
                                                      <table
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                        style="min-width: 200px"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="btn-16 c-white l-white"
                                                            bgcolor="#ff3f3f"
                                                            style="
                                                              font-size: 16px;
                                                              line-height: 20px;
                                                              mso-padding-alt: 15px
                                                                35px;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              text-align: center;
                                                              font-weight: bold;
                                                              text-transform: uppercase;
                                                              border-radius: 25px;
                                                              min-width: auto !important;
                                                              color: #ffffff;
                                                            "
                                                          >
                                                            <a
                                                              href="${link2}"
                                                              target="_blank"
                                                              class="link c-white"
                                                              style="
                                                                display: block;
                                                                padding: 15px
                                                                  35px;
                                                                text-decoration: none;
                                                                color: #ffffff;
                                                              "
                                                            >
                                                              <span
                                                                class="link c-white"
                                                                style="
                                                                  text-decoration: none;
                                                                  color: #ffffff;
                                                                "
                                                                >RESET
                                                                PASSWORD</span
                                                              >
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Intro -->
                                        </td>
                                      </tr>
                                    </table>
                                    <!-- END Main -->
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- END Container -->

                        <!-- Footer -->
                            <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="p-50 mpx-15"
                              bgcolor="#000000"
                              style="
                                border-radius: 0 0 10px 10px;
                                padding: 50px;
                              "
                            >
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    class="text-14 lh-24 a-center c-white l-white pb-20"
                                    style="
                                      font-size: 14px;
                                      font-family: 'PT Sans', Arial, sans-serif;
                                      min-width: auto !important;
                                      line-height: 24px;
                                      text-align: center;
                                      color: #ffffff;
                                      padding-bottom: 20px;
                                    "
                                  >
                                    Address :${constants.address}
                                    <br />
                                    <a
                                      href="tel:+17384796719"
                                      target="_blank"
                                      class="link c-white"
                                      style="
                                        text-decoration: none;
                                        color: #ffffff;
                                      "
                                      ><span
                                        class="link c-white"
                                        style="
                                          text-decoration: none;
                                          color: #ffffff;
                                        "
                                      >
                                        Phn. : ${constants.phone}</span
                                      ></a
                                    >
                                    <br />
                                    <a
                                      href="mailto:info@website.com"
                                      target="_blank"
                                      class="link c-white"
                                      style="
                                        text-decoration: none;
                                        color: #ffffff;
                                      "
                                      ><span
                                        class="link c-white"
                                        style="
                                          text-decoration: none;
                                          color: #ffffff;
                                        "
                                      >
                                        ${constants.contactemail}</span
                                      ></a
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- END Footer -->

                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="text-12 lh-22 a-center c-grey- l-grey py-20"
                              style="
                                font-size: 12px;
                                color: #6e6e6e;
                                font-family: 'PT Sans', Arial, sans-serif;
                                min-width: auto !important;
                                line-height: 22px;
                                text-align: center;
                                padding-top: 20px;
                                padding-bottom: 20px;
                              "
                            >
                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>

                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>

                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>
                            </td>
                          </tr>
                        </table>
                        <!-- END Bottom -->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;
      const mailOptions = {
        from: constants.adminEmail,
        to: email,
        subject: "Password Reset",
        //   text: `You are receiving this because you (or someone else) has requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:\n\n
        // http://localhost:3000/resetpassword/${user.id}/${token} \n\n
        // If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        html: passbody,
      };

      await transporter.sendMail(mailOptions);
      return res
        .status(200)
        .json({ status: true, message: "Email sent successfully" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ status: false, message: "failed", error });
  }
};

exports.resetpass = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword, oldpassword } = req.body;
  console.log(req.body, "body");

  try {
    const user = await Admin.findById(id);
    if (!user) {
      return res
        .status(500)
        .send({ status: false, message: "Invalid user ID" });
    }
    if (password.includes(" ")) {
      return res
        .status(500)
        .json({ status: false, message: "Password should not have spaces." });
    }

    if (oldpassword && oldpassword !== user.password) {
      return res.status(500).json({
        status: false,
        message: "Current password is incorrect",
      });
    }

    if (user.password === password) {
      return res.status(500).json({
        status: false,
        message: "You cannot keep the previous password as your new password",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decodedToken.id !== user.id) {
      return res.status(500).send({ status: false, message: "Invalid token" });
    }
    // Hash the password before saving
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = password;
    await user.save();

    res.send({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server error" });
  }
};

exports.search = async (req, res) => {
  const { query, model, title, populateOptions } = req.body;
  console.log(title);

  try {
    let result;

    result = await mongoose.model(model).find(query).populate(populateOptions);

    console.log(result, result.length, "result***********************");
    console.log(query);
    res.json({ message: "success", success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { firstName, username, lastName, email, mobileno, id } = req.body;

  try {
    const duplicateadminWemail = await Admin.findOne({
      email: email,
      _id: { $ne: id },
    });

    if (duplicateadminWemail) {
      return res.status(500).send({
        status: false,
        message: "Admin with same email already exists",
      });
    }
    const duplicateadminWusername = await Admin.findOne({
      username: username,
      _id: { $ne: id },
    });

    if (duplicateadminWusername) {
      return res.status(500).send({
        status: false,
        message: "Admin with same username already exists",
      });
    }
    const duplicateadminWmobileno = await Admin.findOne({
      mobileno: mobileno,
      _id: { $ne: id },
    });

    if (duplicateadminWmobileno) {
      return res.status(500).send({
        status: false,
        message: "Admin with same mobile number already exists",
      });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { firstName, username, lastName, email, mobileno },
      { new: true }
    );

    if (!updatedAdmin) {
      return res
        .status(404)
        .send({ status: false, message: "Admin not found" });
    }

    const token = jwt.sign(
      {
        id: updatedAdmin._id,
        username: updatedAdmin.username,
        mobileno: updatedAdmin.mobileno,
        role: updatedAdmin.role,
        email: updatedAdmin.email,
        permissions: updatedAdmin.permissions,
        firstname: updatedAdmin.firstName,
        lastname: updatedAdmin.lastName,
        image: updatedAdmin?.image,
      },
      process.env.JWT_SECRET_KEY
    );

    res.status(200).send({
      status: true,
      message: "profile updated",
      data: updatedAdmin,
      token,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: "failed", error });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(500)
        .send({ status: false, message: "no image selected" });
    }

    const admin = await Admin.findById(req.user);

    if (!admin) {
      return res
        .status(404)
        .send({ status: false, message: "Admin not found" });
    }

    if (admin.image) {
      const ImagePath = `uploads/profile/${admin.image}`;
      // Delete the old image file if it exists
      if (fs.existsSync(ImagePath)) {
        fs.unlink(ImagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }
    }

    admin.image = req.file.filename;

    const updatedAdmin = await admin.save();

    const token = jwt.sign(
      {
        id: updatedAdmin._id,
        username: updatedAdmin.username,
        mobileno: updatedAdmin.mobileno,
        role: updatedAdmin.role,
        email: updatedAdmin.email,
        permissions: updatedAdmin.permissions,
        firstname: updatedAdmin.firstName,
        lastname: updatedAdmin.lastName,
        image: updatedAdmin?.image,
      },
      process.env.JWT_SECRET_KEY
    );

    res.status(200).send({
      status: true,
      message: "profile updated",
      data: updatedAdmin,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: "failed", error });
  }
};

// admin roles
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.params.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Admin profile fetched successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching admin profile",
      error,
    });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    if (req.detail.role !== "superadmin") {
      return res
        .status(500)
        .send({ status: false, message: "You don't have this permission" });
    }
    const admins = await Admin.find({ role: "admin" }).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching admins",
      error,
    });
  }
};

exports.getAllAdminsWPage = async (req, res) => {
  try {
    if (req.detail.role !== "superadmin") {
      return res
        .status(500)
        .send({ status: false, message: "You don't have this permission" });
    }
    const query = { role: "admin" };
    let populateOptions = null;
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const admins = await pagination(
      Admin,
      Admin.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    // const admins = await Admin.find();

    res.status(200).json({
      status: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching admins",
      error,
    });
  }
};

exports.editAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const {
      firstName,
      username,
      lastName,
      email,
      mobileno,
      password,
      permissions,
    } = req.body;

    const duplicateadminWemail = await Admin.findOne({
      email: email,
      _id: { $ne: adminId },
    });

    if (duplicateadminWemail) {
      return res.status(500).send({
        status: false,
        message: "Admin with same email already exists",
      });
    }
    const duplicateadminWusername = await Admin.findOne({
      username: username,
      _id: { $ne: adminId },
    });

    if (duplicateadminWusername) {
      return res.status(500).send({
        status: false,
        message: "Admin with same username already exists",
      });
    }
    const duplicateadminWmobileno = await Admin.findOne({
      mobileno: mobileno,
      _id: { $ne: adminId },
    });

    if (duplicateadminWmobileno) {
      return res.status(500).send({
        status: false,
        message: "Admin with same mobile number already exists",
      });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { firstName, username, lastName, email, mobileno, password, permissions },
      {
        new: true,
      }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating admin",
      error,
    });
  }
};

exports.editAdminStatus = async (req, res) => {
  try {
    if (req.detail.role !== "superadmin") {
      return res
        .status(500)
        .send({ status: false, message: "You don't have this permission" });
    }
    const adminId = req.params.id;
    const { status } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { status },
      {
        new: true,
      }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Admin status updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin status:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating admin status",
      error,
    });
  }
};

// user roles
exports.getAllUsersWPage = async (req, res) => {
  try {
    const query = {};
    let populateOptions = null;
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const users = await pagination(
      User,
      User.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    // const admins = await Admin.find();

    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching users",
      error,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching Users:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching Users",
      error,
    });
  }
};

exports.editUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    let emailbody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i&display=swap"
      rel="stylesheet"
    />
    <!--<![endif]-->
    <title>Email Template</title>
    <!--[if gte mso 9]>
      <style type="text/css" media="all">
        sup {
          font-size: 100% !important;
        }
      </style>
    <![endif]-->
    <!-- body, html, table, thead, tbody, tr, td, div, a, span { font-family: Arial, sans-serif !important; } -->

    <style type="text/css" media="screen">
      body {
        padding: 0 !important;
        margin: 0 auto !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        background: #f4ecfa;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #ff3f3f;
        text-decoration: none;
      }
      p {
        padding: 0 !important;
        margin: 0 !important;
      }
      img {
        margin: 0 !important;
        -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      .btn-16 a {
        display: block;
        padding: 15px 35px;
        text-decoration: none;
      }
      .btn-20 a {
        display: block;
        padding: 15px 35px;
        text-decoration: none;
      }

      .l-white a {
        color: #ffffff;
      }
      .l-black a {
        color: #282828;
      }
      .l-pink a {
        color: #ff3f3f;
      }
      .l-grey a {
        color: #6e6e6e;
      }
      .l-purple a {
        color: #9128df;
      }

      .gradient {
        /* background: linear-gradient(90deg, #5170ff, #ff66c4); */
        background: #ff3f3f;
      }

      .btn-secondary {
        border-radius: 10px;
        background: linear-gradient(90deg, #5170ff, #ff66c4);
      }

      /* Mobile styles */
      @media only screen and (max-device-width: 480px),
        only screen and (max-width: 480px) {
        .mpx-10 {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .mpx-15 {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        u + .body .gwfw {
          width: 100% !important;
          width: 100vw !important;
        }

        .td,
        .m-shell {
          width: 100% !important;
          min-width: 100% !important;
        }

        .mt-left {
          text-align: left !important;
        }
        .mt-center {
          text-align: center !important;
        }
        .mt-right {
          text-align: right !important;
        }

        .me-left {
          margin-right: auto !important;
        }
        .me-center {
          margin: 0 auto !important;
        }
        .me-right {
          margin-left: auto !important;
        }

        .mh-auto {
          height: auto !important;
        }
        .mw-auto {
          width: auto !important;
        }

        .fluid-img img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }

        .column,
        .column-top,
        .column-dir-top {
          float: left !important;
          width: 100% !important;
          display: block !important;
        }

        .m-hide {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          font-size: 0 !important;
          line-height: 0 !important;
          min-height: 0 !important;
        }
        .m-block {
          display: block !important;
        }

        .mw-15 {
          width: 15px !important;
        }

        .mw-2p {
          width: 2% !important;
        }
        .mw-32p {
          width: 32% !important;
        }
        .mw-49p {
          width: 49% !important;
        }
        .mw-50p {
          width: 50% !important;
        }
        .mw-100p {
          width: 100% !important;
        }

        .mmt-0 {
          margin-top: 0 !important;
        }
      }
    </style>
  </head>
  <body
    class="body"
    style="
      padding: 0 !important;
      margin: 0 auto !important;
      display: block !important;
      min-width: 100% !important;
      width: 100% !important;
      background: #f4ecfa;
      -webkit-text-size-adjust: none;
    "
  >
    <center>
      <table
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="margin: 0; padding: 0; width: 100%; height: 100%"
        bgcolor="#f4ecfa"
        class="gwfw"
      >
        <tr>
          <td
            style="margin: 0; padding: 0; width: 100%; height: 100%"
            align="center"
            valign="top"
          >
            <table
              width="600"
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="m-shell"
            >
              <tr>
                <td
                  class="td"
                  style="
                    width: 600px;
                    min-width: 600px;
                    font-size: 0pt;
                    line-height: 0pt;
                    padding: 0;
                    margin: 0;
                    font-weight: normal;
                  "
                >
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                  >
                    <tr>
                      <td class="mpx-10">
                        <!-- Top -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="text-12 c-grey l-grey a-right py-20"
                              style="
                                font-size: 12px;
                                line-height: 16px;
                                font-family: 'PT Sans', Arial, sans-serif;
                                min-width: auto !important;
                                color: #6e6e6e;
                                text-align: right;
                                padding-top: 20px;
                                padding-bottom: 20px;
                              "
                            >
                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="text-decoration: none; color: #6e6e6e"
                                ></span
                              ></a>
                            </td>
                          </tr>
                        </table>
                        <!-- END Top -->

                        <!-- Container -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="gradient pt-10"
                              style="
                                border-radius: 10px 10px 0 0;
                                padding-top: 10px;
                              "
                              bgcolor="rgb(189, 50, 40)"
                            >
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    style="border-radius: 10px 10px 0 0"
                                    bgcolor="#ffffff"
                                  >
                                    <!-- Logo -->
                                    <div
                                      style="
                                        font-size: 15px;
                                        padding: 5px 50px;
                                        display: flex;
                                        gap: 10px;
                                      "
                                    >
                                      <img
                                        style="height: 35px"
                                        src="http://localhost:3000/assets/img/logo.png"
                                        alt=""
                                      />
                                      <h2>Ecom</h2>
                                    </div>
                                    <!-- Logo -->
                                    <!-- <hr> -->
                                    <!-- Main -->
                                    <table
                                      width="100%"
                                      border="0"
                                      cellspacing="0"
                                      cellpadding="0"
                                    >
                                      <tr>
                                        <td
                                          class="px-50 mpx-15"
                                          style="
                                            padding-left: 50px;
                                            padding-right: 50px;
                                          "
                                        >
                                          <!-- Section - Intro -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-50"
                                                style="padding-bottom: 50px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <!-- <tr>
                                                                <td
                                                                  class="fluid-img img-center pb-50"
                                                                  style="
                                                                    font-size: 0pt;
                                                                    line-height: 0pt;
                                                                    text-align: center;
                                                                    padding-bottom: 50px;
                                                                  "
                                                                >
                                                                  <img
                                                                    src="../images/img_intro_4.png"
                                                                    width="368"
                                                                    height="296"
                                                                    border="0"
                                                                    alt=""
                                                                  />
                                                                </td>
                                                              </tr> -->
                                                  <hr />
                                                  <tr>
                                                    <td
                                                      class="title-36 a-center pb-15"
                                                      style="
                                                        font-size: 36px;
                                                        line-height: 40px;
                                                        color: #282828;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        text-align: start;
                                                        padding-bottom: 15px;
                                                        padding-top: 15px;
                                                      "
                                                    >
                                                      <strong
                                                        >Account
                                                          ${
                                                            status === 1
                                                              ? `Activated!`
                                                              : status === 2
                                                              ? `Blocked`
                                                              : `Deactivated`
                                                          }</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="text-16 lh-26 a-center pb-25"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: start;
                                                        padding-bottom: 25px;
                                                      "
                                                    >
                                                      <strong
                                                        >Hi ${
                                                          updatedUser.username
                                                        },</strong
                                                      >
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td
                                                      class="text-16 lh-26 a-center pb-25"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: start;
                                                        padding-bottom: 25px;
                                                      "
                                                    >
                                                      ${
                                                        status === 1
                                                          ? `${constants.accActivatedContent}`
                                                          : status === 2
                                                          ? `${constants.accBlockedContent}`
                                                          : `${constants.accDeactivatedContent}`
                                                      }
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="text-16 lh-26 a-center pb-25"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: start;
                                                      "
                                                    >
                                                      Regards,
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="text-16 lh-26 a-center pb-25"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: start;
                                                        padding-bottom: 25px;
                                                      "
                                                    >
                                                      ${constants.regards}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Intro -->
                                        </td>
                                      </tr>
                                    </table>
                                    <!-- END Main -->
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- END Container -->

                        <!-- Footer -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="p-50 mpx-15"
                              bgcolor="#000000"
                              style="
                                border-radius: 0 0 10px 10px;
                                padding: 50px;
                              "
                            >
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    class="text-14 lh-24 a-center c-white l-white pb-20"
                                    style="
                                      font-size: 14px;
                                      font-family: 'PT Sans', Arial, sans-serif;
                                      min-width: auto !important;
                                      line-height: 24px;
                                      text-align: center;
                                      color: #ffffff;
                                      padding-bottom: 20px;
                                    "
                                  >
                                    Address :${constants.address}
                                    <br />
                                    <a
                                      href="tel:+17384796719"
                                      target="_blank"
                                      class="link c-white"
                                      style="
                                        text-decoration: none;
                                        color: #ffffff;
                                      "
                                      ><span
                                        class="link c-white"
                                        style="
                                          text-decoration: none;
                                          color: #ffffff;
                                        "
                                      >
                                        Phn. : ${constants.phone}</span
                                      ></a
                                    >
                                    <br />
                                    <a
                                      href="mailto:info@website.com"
                                      target="_blank"
                                      class="link c-white"
                                      style="
                                        text-decoration: none;
                                        color: #ffffff;
                                      "
                                      ><span
                                        class="link c-white"
                                        style="
                                          text-decoration: none;
                                          color: #ffffff;
                                        "
                                      >
                                        ${constants.contactemail}</span
                                      ></a
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- END Footer -->

                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="text-12 lh-22 a-center c-grey- l-grey py-20"
                              style="
                                font-size: 12px;
                                color: #6e6e6e;
                                font-family: 'PT Sans', Arial, sans-serif;
                                min-width: auto !important;
                                line-height: 22px;
                                text-align: center;
                                padding-top: 20px;
                                padding-bottom: 20px;
                              "
                            >
                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>

                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>

                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>
                            </td>
                          </tr>
                        </table>
                        <!-- END Bottom -->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>

    `;

    // Send email to admin
    const mailOptions = {
      from: constants.adminEmail,
      to: updatedUser.email,
      subject: "Account Update",
      html: emailbody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({
      status: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating User status:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating User status",
      error,
    });
  }
};
