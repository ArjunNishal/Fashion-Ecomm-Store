const { constants } = require("../constants");
const ContactUs = require("../models/ContactUsSchema");
const Newsletter = require("../models/newsletterSchema");
const Subscriber = require("../models/newslettersubsSchema");
const Product = require("../models/productSchema");
const Query = require("../models/QuerySchema");
const User = require("../models/userSchema");

const { transporter } = require("./emailTransporter");
const { pagination } = require("./pagination");

exports.addContactUs = async (req, res) => {
  try {
    const { name, email, mobileno, message } = req.body;

    const newContact = new ContactUs({
      name,
      email,
      mobileno,
      message,
    });

    await newContact.save();

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
                                          <!-- Section - Posts -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-15"
                                                style="padding-bottom: 15px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="title-26 a-center pb-35"
                                                      style="
                                                        font-size: 26px;
                                                        line-height: 30px;
                                                        color: #282828;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        text-align: center;
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <strong
                                                        >New Contact Form
                                                        Submission</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Name</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${name}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Email</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${email}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Mobile</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${mobileno}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Message</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${message}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Posts -->
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
      from: email,
      to: constants.adminEmail,
      subject: "New Contact Us Form Submission",
      html: emailbody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // send email to user for confirmation

    let Useremailbody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                                        >Query Submitted
                                                        Successfully!</strong
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
                                                        >Dear ${name},</strong
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
                                                      ${constants.contactusContent}
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

    const UsermailOptions = {
      from: constants.adminEmail,
      to: email,
      subject: "Query Submitted Successfully",
      html: Useremailbody,
    };

    transporter.sendMail(UsermailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res
      .status(201)
      .json({ status: true, message: "Contact form submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to submit contact form", error });
  }
};

exports.getAllContactUs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await pagination(
      ContactUs,
      ContactUs.find()
        .populate({
          path: "updatedby",
          select: "-password",
        })
        .sort({ status: -1, createdAt: -1 }),
      // .populate("reviews.user", "firstname lastname username email"),
      { page, limit }
    );

    res.status(200).json({
      status: true,
      data: results,
      message: "Fetched all contact us queries",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch contact forms", error });
  }
};

exports.editContactUsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await ContactUs.findByIdAndUpdate(
      id,
      { status, updatedby: req.user },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact form not found" });
    }

    res.status(200).json({
      status: true,
      message: "Contact form status updated",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to update contact form status",
      error,
    });
  }
};

// QUERY Controllers below ================================

exports.addQuery = async (req, res) => {
  try {
    const { name, email, mobileno, subject, message } = req.body;

    const newQuery = new Query({
      name,
      email,
      mobileno,
      subject,
      message,
    });

    await newQuery.save();

    // Send email to admin

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
                                          <!-- Section - Posts -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-15"
                                                style="padding-bottom: 15px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="title-26 a-center pb-35"
                                                      style="
                                                        font-size: 26px;
                                                        line-height: 30px;
                                                        color: #282828;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        text-align: center;
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <strong
                                                        >New Query Form
                                                        Submission</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Name</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${name}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Email</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${email}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Mobile</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${mobileno}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Subject</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${subject}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- form item -->
                                                  <tr>
                                                    <td
                                                      class="pb-35"
                                                      style="
                                                        padding-bottom: 35px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td valign="top">
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-5"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 5px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Message</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-14 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                >
                                                                  ${message}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Posts -->
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
      from: email,
      to: constants.adminEmail,
      subject: "New Query Form Submission",
      html: emailbody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // send email to user for confirmation

    let Useremailbody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                                        >Query Submitted
                                                        Successfully!</strong
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
                                                        >Dear ${name},</strong
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
                                                      ${constants.queryContent}
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

    const UsermailOptions = {
      from: constants.adminEmail,
      to: email,
      subject: "Query Submitted Successfully",
      html: Useremailbody,
    };

    transporter.sendMail(UsermailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      status: true,
      message: "Query submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to submit query",
      error,
    });
  }
};

exports.getAllQueries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await pagination(
      Query,
      Query.find()
        .populate({
          path: "updatedby",
          select: "-password",
        })
        .sort({ status: -1, createdAt: -1 }),
      // .populate("reviews.user", "firstname lastname username email"),
      { page, limit }
    );

    res.status(200).json({
      status: true,
      data: results,
      message: "Fetched all queries",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch queries",
      error,
    });
  }
};

exports.editQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = await Query.findByIdAndUpdate(
      id,
      { status, updatedby: req.user },
      { new: true }
    ).populate({
      path: "updatedby",
      select: "-password",
    });

    if (!query) {
      return res.status(404).json({
        status: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Query status updated",
      data: query,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to update query status",
      error,
    });
  }
};

exports.getAllNewsletters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await pagination(
      Newsletter,
      Newsletter.find()
        .sort({ createdAt: -1 })
        .populate("createdby")
        .populate("selectedproducts"),

      { page, limit }
    );

    // const newsletters = await Newsletter.find().sort({ createdAt: -1 }); // Fetch all newsletters, sorted by creation date
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve newsletters",
      error: error.message,
    });
  }
};

exports.sendNewsletter = async (req, res) => {
  try {
    const {
      heading,
      subheading,
      subject,
      btntext,
      btnurl,
      btmheading,
      btmsubheading,
      selectedproducts,
    } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    const newNewsletter = new Newsletter({
      heading,
      subheading,
      subject,
      btntext,
      btnurl,
      btmheading,
      btmsubheading,
      selectedproducts: JSON.parse(selectedproducts),
      images,
      createdby: req.user,
    });

    const savedNewsletter = await newNewsletter.save();
    console.log(savedNewsletter, "1");
    res.status(201).json({
      status: true,
      message: "Newsletter Created successfully!",
      data: savedNewsletter,
    });

    console.log(savedNewsletter, "2");

    await sendNewsletterEmail(savedNewsletter._id);
  } catch (error) {
    console.error("Error creating newsletter:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the newsletter.",
      error: error.message,
    });
  }
};

const sendNewsletterEmail = async (letterid) => {
  const usersFromUserCollection = await User.find({ subscribed: true });

  const subscribers = await Subscriber.find({ subscribed: true });

  const combinedUsers = [
    ...usersFromUserCollection.map((user) => ({ email: user.email })),
    ...subscribers.map((subscriber) => ({ email: subscriber.email })),
  ];

  const uniqueUsers = Array.from(
    new Set(combinedUsers.map((user) => user.email))
  ).map((email) => {
    return combinedUsers.find((user) => user.email === email);
  });

  let products = [];

  const letter = await Newsletter.findById(letterid).populate(
    "selectedproducts"
  );

  products = letter.selectedproducts;

  // console.log(cartItems.map((item, index) => item));
  const subject = letter.subject;

  let itemCards = "";
  if (products.length > 0) {
    itemCards = `
     <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="py-50"
                                                style="
                                                  padding-top: 50px;
                                                  padding-bottom: 50px;
                                                "
                                              >
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
    `;

    products.forEach((product, index) => {
      if (index % 2 === 0 && index !== 0) {
        itemCards += `
          </tr>
          <tr>
        `;
      }

      itemCards += `
        <th class="column-top" valign="top" width="240" style="font-size: 0pt;  line-height: 0pt; padding: 0; margin: 0; font-weight: normal; vertical-align: top;">
          <table width="100%" style="    padding-bottom: 20px;" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="p-30 mpx-15" style="border-radius: 10px; padding: 30px;" bgcolor="#f4ecfa">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="position: relative; z-index: 1; margin-top: -90px;">
                        <tr>
                          <td class="img-center pb-20" style="font-size: 0pt; line-height: 0pt; text-align: center; padding-bottom: 20px;">
                            <img src="${constants.renderUrl}uploads/product/${product.thumbnail}" width="110" height="110" border="0" alt="" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="title-20 a-center c-purple l-purple pb-5" style="font-size: 20px; line-height: 24px; font-family: 'PT Sans', Arial, sans-serif; min-width: auto !important; text-align: center; padding-bottom: 5px;">
                      <small><strike>&#8377;${product.actualPrice}</strike></small>
                      <strong style="color: #ff3f3f;">&#8377;${product.price}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-16 lh-26 c-black l-black a-center" style="font-size: 16px; font-family: 'PT Sans', Arial, sans-serif; min-width: auto !important; line-height: 26px; color: #282828; text-align: center;">
                      <strong>${product.productName}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </th>
      `;

      // Add a spacer column between the two cards, except after the last one in a row
      if (index % 2 === 0 && index !== products.length - 1) {
        itemCards += `
          <th class="column-top mpb-100" valign="top" width="20" style="font-size: 0pt; line-height: 0pt; padding: 0; margin: 0; font-weight: normal; vertical-align: top;"></th>
        `;
      }
    });

    itemCards += `
        </tr>
      </table>
      </td>
                                            </tr>
                                          </table>
    `;
  }

  let body = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
        color: #ff3f3f;
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
                            ></td>
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
                              bgcolor="#f3189e"
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
                                    <table
                                      width="100%"
                                      border="0"
                                      cellspacing="0"
                                      cellpadding="0"
                                    >
                                      <tr>
                                        <td
                                          class="img-center p-30 px-15"
                                          style="
                                            font-size: 0pt;
                                            line-height: 0pt;
                                            text-align: center;
                                            padding: 30px;
                                            padding-left: 15px;
                                            padding-right: 15px;
                                          "
                                        >
                                          <a href="#" target="_blank"
                                            ><img
                                              src="../images/logo.png"
                                              width="112"
                                              height="43"
                                              border="0"
                                              alt=""
                                          /></a>
                                        </td>
                                      </tr>
                                    </table>
                                    <!-- Logo -->

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
                                                  ${
                                                    letter.heading
                                                      ? `<tr>
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
                                                      "
                                                    >
                                                      <strong
                                                        >${letter.heading}</strong
                                                      >
                                                    </td>
                                                  </tr>`
                                                      : ``
                                                  }
                                                  ${
                                                    letter.subheading
                                                      ? `<tr>
                                                    <td
                                                      class="text-16 lh-26 a-center"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: center;
                                                      "
                                                    >
                                                    ${letter.subheading}
                                                    </td>
                                                  </tr>`
                                                      : ``
                                                  }
                                                  ${
                                                    letter.images.length > 0 &&
                                                    letter.images.map(
                                                      (img) =>
                                                        `<tr>
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
                                                            src="${constants.renderUrl}uploads/newsletter/${img}"
                                                            style="
                                                          width: 100%;
                                                          height: auto;
                                                          object-fit: contain;
                                                        "
                                                            border="0"
                                                            alt="img"
                                                          />
                                                        </td>
                                                      </tr>`
                                                    )
                                                  }
                                                  
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Intro -->

                                          <!-- Section - Offers -->
                                         ${itemCards}
                                          <!-- END Section - Offers -->

                                          <!-- Button -->
                                          
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
                                                  ${
                                                    letter.btntext &&
                                                    letter.btnurl
                                                      ? `<tr>
                                                    <td
                                                      align="center"
                                                      class="pb-15"
                                                      style="
                                                        padding-bottom: 15px;
                                                      "
                                                    >
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
                                                              href="${letter.btnurl}"
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
                                                                >${letter.btntext}</span
                                                              >
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>  `
                                                      : ``
                                                  }
                                                  ${
                                                    letter.btmheading
                                                      ? `<tr>
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
                                                      "
                                                    >
                                                      <strong
                                                        >${letter.btmheading}</strong
                                                      >
                                                    </td>
                                                  </tr>  `
                                                      : ``
                                                  }
                                                  ${
                                                    letter.btmsubheading
                                                      ? `<tr>
                                                    <td
                                                      class="text-14 a-center c-grey l-grey"
                                                      style="
                                                        font-size: 14px;
                                                        line-height: 18px;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        text-align: center;
                                                        color: #6e6e6e;
                                                      "
                                                    >
                                                      <em
                                                        >${letter.btmsubheading}
                                                     </em>
                                                    </td>
                                                  </tr>  `
                                                      : ``
                                                  }
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          
                                          <!-- END Button -->
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

                        <!-- Bottom -->
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

  for (const user of uniqueUsers) {
    const mailOptions = {
      from: constants.adminEmail,
      to: user.email, // Sending to each user's email
      subject: subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);
    console.log(user.email);
  }
};
