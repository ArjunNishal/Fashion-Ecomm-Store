const mongoose = require("mongoose");
const Order = require("../models/OrderSchema");
const { constants } = require("../constants");
const { transporter } = require("./emailTransporter");
const { pagination } = require("./pagination");
const Cart = require("../models/cartSchema");
const User = require("../models/userSchema");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      name,
      address,
      mobileno,
      email,
      orderNotes,
      items,
      ordertotal,
      city,
      state,
      country,
      postcode,
      subscribe,
    } = req.body;

    const addressdetails = {
      address,
      city,
      state,
      country,
      postcode,
    };

    const user = req.user ? req.user : null;

    if (user) {
      const subscribedUser = await User.findById(user);
      subscribedUser.subscribed = subscribe;
      await subscribedUser.save();
    }

    const order = new Order({
      user,
      name,
      address: addressdetails,
      mobileno,
      email,
      orderNotes,
      items,
      ordertotal,
    });
    await order.save();
    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while creating the order",
      error,
    });
  }
};

// Edit order status
const editOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderstatus: status },
      { new: true }
    );

    await sendOrderStatusEmail(order);

    res.status(200).json({
      status: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the order status",
      error,
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user");
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the order",
      error,
    });
  }
};

// Get orders by user ID with lazy loading
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    console.log(req.query);
    const orders = await Order.find({ user: userId })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate("user")
      .sort({ paymentStatus: 1, createdAt: -1 });

    const totalorders = await Order.countDocuments();

    console.log(orders, userId);
    res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: { orders, totalorders },
    });
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the orders",
      error,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await pagination(
      Order,
      Order.find()
        .populate({
          path: "user",
        })
        .sort({ createdAt: -1 }),
      { page, limit }
    );

    // const orders = await Order.find().populate("user");
    res.status(200).json({
      status: true,
      message: "All orders fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching all orders",
      error,
    });
  }
};

// Get order by ID and user ID
const getOrderByIdAndUserId = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const order = await Order.findOne({ _id: id, user: userId }).populate(
      "user"
    );
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order by ID and user ID:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the order",
      error,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id; // Assuming the order ID is sent as a URL parameter

    // Find the order by ID
    const order = await Order.findById(orderId).populate("user", "-password");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.paymentStatus === true) {
      return res
        .status(200)
        .json({ message: "Payment status updated successfully" });
    }

    // Update the paymentStatus to true
    order.paymentStatus = true;
    order.orderstatus = "order_placed";
    await order.save();
    console.log("payment done1");
    await sendOrderConfirmation(order);

    // Send a response indicating success
    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendOrderConfirmation = async (order) => {
  console.log("payment done2");
  const mailOptions = {
    from: constants.adminEmail,
    to: order.email,
    subject: "Order Placed",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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

        .mpb-15 {
          padding-bottom: 15px !important;
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
                                    <div
                                      style="
                                        font-size: 15px;
                                        padding: 5px 50px;
                                        display: flex;
                                        gap: 10px;
                                      "
                                    >
                                      <img style="height: 35px" src="" alt="" />
                                      <h2>Ecom</h2>
                                    </div>
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
                                                style="
                                                  padding-bottom: 50px;
                                                  padding-top: 20px;
                                                "
                                              >
                                                <hr />
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="title-36 a-center pb-15"
                                                      style="
                                                        padding-top: 10px;
                                                        font-size: 25px;
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
                                                        >Thank you for placing
                                                        your order.</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <tr>
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
                                                      Hi ${order?.name},
                                                      your order is placed.
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Intro -->

                                          <!-- Section - Order Details -->
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
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <!-- Button -->
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="btn-20 btn-secondary c-white l-white"
                                                            bgcolor="#f3189e"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              mso-padding-alt: 15px
                                                                35px;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              text-align: center;
                                                              font-weight: bold;
                                                              text-transform: uppercase;
                                                              min-width: auto !important;
                                                              border-radius: 10px;
                                                              background: #ff3f3f;
                                                              color: #ffffff;
                                                            "
                                                          >
                                                            <div
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
                                                                >ORDER
                                                                DETAILS</span
                                                              >
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  class="title-20 pb-10"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 10px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Shipping
                                                                    details</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 20px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                  "
                                                                >
                                                                  ${
                                                                    order
                                                                      .address
                                                                      .address
                                                                  },${
      order.address.city
    },${order.address.state},${order.address.country},Pin :
                                                                  ${
                                                                    order
                                                                      .address
                                                                      .postcode
                                                                  }
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-40"
                                                      style="
                                                        padding-bottom: 40px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  ${order.items
                                                    .map(
                                                      (item, index) => `
                                                  <tr key='${index}' >
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          >
                                                            <div
                                                              class="fluid-img"
                                                              style="
                                                                font-size: 0pt;
                                                                line-height: 0pt;
                                                                text-align: left;
                                                              "
                                                            >
                                                              <a
                                                                href="#"
                                                                target="_blank"
                                                              >
                                                                <img
                                                                  src="${
                                                                    constants.renderUrl
                                                                  }uploads/product/${
                                                        item.product.thumbnail
                                                      }"
                                                                  border="0"
                                                                  width="230"
                                                                  height="180"
                                                                  alt=""
                                                                />
                                                              </a>
                                                            </div>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  class="title-20 pb-10"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 10px;
                                                                  "
                                                                >
                                                                  <strong>
                                                                    ${
                                                                      item
                                                                        .product
                                                                        .productName
                                                                    }
                                                                  </strong>
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16 lh-26 c-black"
                                                                  style="
                                                                    font-size: 16px;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 26px;
                                                                    color: #282828;
                                                                  "
                                                                >
                                                                 
                                                                  <strong>
                                                                    Qty:
                                                                  </strong>
                                                                  ${
                                                                    item.quantity
                                                                  }
                                                                  <br />
                                                                  <strong>
                                                                    Price:
                                                                  </strong>
                                                                  ₹${
                                                                    item.product
                                                                      .price *
                                                                    item.quantity
                                                                  }
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  `
                                                    )
                                                    .join("")}
                                                  <tr>
                                                    <td
                                                      class="pt-10 pb-40"
                                                      style="
                                                        padding-top: 10px;
                                                        padding-bottom: 40px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  align="right"
                                                                  class="pb-15"
                                                                  style="
                                                                    padding-bottom: 15px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellspacing="0"
                                                                    cellpadding="0"
                                                                    class="mw-100p"
                                                                  >
                                                                    <tr>
                                                                      <td
                                                                        class="title-20 lh-30 a-right mt-left mw-auto"
                                                                        width="100"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                          text-align: right;
                                                                        "
                                                                      >
                                                                        <strong
                                                                          >Subtotal:</strong
                                                                        >
                                                                      </td>
                                                                      <td
                                                                        class="img mw-15"
                                                                        width="20"
                                                                        style="
                                                                          font-size: 0pt;
                                                                          line-height: 0pt;
                                                                          text-align: left;
                                                                        "
                                                                      ></td>
                                                                      <td
                                                                        class="title-20 lh-30 mt-right"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                        "
                                                                      >
                                                                        &#8377;${
                                                                          order.ordertotal
                                                                        }
                                                                      </td>
                                                                    </tr>
                                                                    <tr>
                                                                      <td
                                                                        class="title-20 lh-30 a-right mt-left"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                          text-align: right;
                                                                        "
                                                                      >
                                                                        <strong
                                                                          >Shipping:</strong
                                                                        >
                                                                      </td>
                                                                      <td
                                                                        class="img mw-15"
                                                                        style="
                                                                          font-size: 0pt;
                                                                          line-height: 0pt;
                                                                          text-align: left;
                                                                        "
                                                                      ></td>
                                                                      <td
                                                                        class="title-20 lh-30 mt-right"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                        "
                                                                      >
                                                                        ₹0.00
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  align="right"
                                                                >
                                                                  <!-- Button -->
                                                                  <table
                                                                    border="0"
                                                                    cellspacing="0"
                                                                    cellpadding="0"
                                                                    class="mw-100p"
                                                                    style="
                                                                      min-width: 200px;
                                                                    "
                                                                  >
                                                                    <tr>
                                                                      <td
                                                                        class="btn-20 btn-secondary c-white l-white"
                                                                        bgcolor="#f3189e"
                                                                        style="
                                                                          font-size: 20px;
                                                                          line-height: 24px;
                                                                          mso-padding-alt: 15px
                                                                            35px;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: center;
                                                                          font-weight: bold;
                                                                          text-transform: uppercase;
                                                                          min-width: auto !important;
                                                                          border-radius: 10px;
                                                                          background: #ff3f3f;
                                                                          color: #ffffff;
                                                                        "
                                                                      >
                                                                        <div
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
                                                                            >TOTAL:
                                                                            ₹${
                                                                              order.ordertotal
                                                                            }</span
                                                                          >
                                                                        </div>
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                  <!-- END Button -->
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
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
                                                      <em
                                                        >Thank you for choosing
                                                        our service. We hope you
                                                        enjoy your products!
                                                      </em>
                                                    </td>
                                                  </tr>
                                                  ${
                                                    order.user !== null &&
                                                    `<tr>
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
                                                              href="${constants.frontUrl}profile/${order.user}"
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
                                                                >VIEW MY
                                                                ORDER</span
                                                              >
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>`
                                                  }
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Order Details -->
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
`,
  };

  await transporter.sendMail(mailOptions);
};

const sendPaymentFailed = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user");

  if (!order) {
    return res.status(500).send({ status: false, message: "order not found" });
  }

  const mailOptions = {
    from: constants.adminEmail,
    to: order.email,
    subject: "Payment Failed",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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

        .mpb-15 {
          padding-bottom: 15px !important;
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
                                    <div
                                      style="
                                        font-size: 15px;
                                        padding: 5px 50px;
                                        display: flex;
                                        gap: 10px;
                                      "
                                    >
                                      <img style="height: 35px" src="" alt="" />
                                      <h2>Ecom</h2>
                                    </div>
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
                                                style="
                                                  padding-bottom: 50px;
                                                  padding-top: 20px;
                                                "
                                              >
                                                <hr />
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="title-36 a-center pb-15"
                                                      style="
                                                        padding-top: 10px;
                                                        font-size: 25px;
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
                                                        >Payment Failed</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <tr>
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
                                                      Hi ${order?.name},
                                                      your payment for the order
                                                      has failed, please retry
                                                      using the link below.
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Intro -->

                                          <!-- Section - Order Details -->
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
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <!-- Button -->
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="btn-20 btn-secondary c-white l-white"
                                                            bgcolor="#f3189e"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              mso-padding-alt: 15px
                                                                35px;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              text-align: center;
                                                              font-weight: bold;
                                                              text-transform: uppercase;
                                                              min-width: auto !important;
                                                              border-radius: 10px;
                                                              background: #ff3f3f;
                                                              color: #ffffff;
                                                            "
                                                          >
                                                            <div
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
                                                                >ORDER
                                                                DETAILS</span
                                                              >
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  class="title-20 pb-10"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 10px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Shipping
                                                                    details</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 20px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                  "
                                                                >
                                                                  ${
                                                                    order
                                                                      .address
                                                                      .address
                                                                  },${
      order.address.city
    },${order.address.state},${order.address.country},Pin
                                                                  : ${
                                                                    order
                                                                      .address
                                                                      .postcode
                                                                  }
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-40"
                                                      style="
                                                        padding-bottom: 40px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  ${order.items
                                                    .map(
                                                      (item, index) => `
                                                  <tr key="${index}">
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          >
                                                            <div
                                                              class="fluid-img"
                                                              style="
                                                                font-size: 0pt;
                                                                line-height: 0pt;
                                                                text-align: left;
                                                              "
                                                            >
                                                              <a
                                                                href="#"
                                                                target="_blank"
                                                              >
                                                                <img
                                                                  src="${
                                                                    constants.renderUrl
                                                                  }uploads/product/${
                                                        item.product.thumbnail
                                                      }"
                                                                  border="0"
                                                                  width="230"
                                                                  height="180"
                                                                  alt=""
                                                                />
                                                              </a>
                                                            </div>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  class="title-20 pb-10"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 10px;
                                                                  "
                                                                >
                                                                  <strong>
                                                                    ${
                                                                      item
                                                                        .product
                                                                        .productName
                                                                    }
                                                                  </strong>
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16 lh-26 c-black"
                                                                  style="
                                                                    font-size: 16px;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 26px;
                                                                    color: #282828;
                                                                  "
                                                                >
                                                                  <strong>
                                                                    Qty:
                                                                  </strong>
                                                                  ${
                                                                    item.quantity
                                                                  }
                                                                  <br />
                                                                  <strong>
                                                                    Price:
                                                                  </strong>
                                                                  ₹${
                                                                    item.product
                                                                      .price *
                                                                    item.quantity
                                                                  }
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  `
                                                    )
                                                    .join("")}
                                                  <tr>
                                                    <td
                                                      class="pt-10 pb-40"
                                                      style="
                                                        padding-top: 10px;
                                                        padding-bottom: 40px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  align="right"
                                                                  class="pb-15"
                                                                  style="
                                                                    padding-bottom: 15px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellspacing="0"
                                                                    cellpadding="0"
                                                                    class="mw-100p"
                                                                  >
                                                                    <tr>
                                                                      <td
                                                                        class="title-20 lh-30 a-right mt-left mw-auto"
                                                                        width="100"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                          text-align: right;
                                                                        "
                                                                      >
                                                                        <strong
                                                                          >Subtotal:</strong
                                                                        >
                                                                      </td>
                                                                      <td
                                                                        class="img mw-15"
                                                                        width="20"
                                                                        style="
                                                                          font-size: 0pt;
                                                                          line-height: 0pt;
                                                                          text-align: left;
                                                                        "
                                                                      ></td>
                                                                      <td
                                                                        class="title-20 lh-30 mt-right"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                        "
                                                                      >
                                                                        &#8377;${
                                                                          order.ordertotal
                                                                        }
                                                                      </td>
                                                                    </tr>
                                                                    <tr>
                                                                      <td
                                                                        class="title-20 lh-30 a-right mt-left"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                          text-align: right;
                                                                        "
                                                                      >
                                                                        <strong
                                                                          >Shipping:</strong
                                                                        >
                                                                      </td>
                                                                      <td
                                                                        class="img mw-15"
                                                                        style="
                                                                          font-size: 0pt;
                                                                          line-height: 0pt;
                                                                          text-align: left;
                                                                        "
                                                                      ></td>
                                                                      <td
                                                                        class="title-20 lh-30 mt-right"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                        "
                                                                      >
                                                                        ₹0.00
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  align="right"
                                                                >
                                                                  <!-- Button -->
                                                                  <table
                                                                    border="0"
                                                                    cellspacing="0"
                                                                    cellpadding="0"
                                                                    class="mw-100p"
                                                                    style="
                                                                      min-width: 200px;
                                                                    "
                                                                  >
                                                                    <tr>
                                                                      <td
                                                                        class="btn-20 btn-secondary c-white l-white"
                                                                        bgcolor="#f3189e"
                                                                        style="
                                                                          font-size: 20px;
                                                                          line-height: 24px;
                                                                          mso-padding-alt: 15px
                                                                            35px;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: center;
                                                                          font-weight: bold;
                                                                          text-transform: uppercase;
                                                                          min-width: auto !important;
                                                                          border-radius: 10px;
                                                                          background: #ff3f3f;
                                                                          color: #ffffff;
                                                                        "
                                                                      >
                                                                        <div
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
                                                                            >TOTAL:
                                                                            ₹${
                                                                              order.ordertotal
                                                                            }</span
                                                                          >
                                                                        </div>
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                  <!-- END Button -->
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
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
                                                      <em
                                                        >${
                                                          order.user !== null
                                                            ? `Please Login and Retry payment.`
                                                            : `Please use the link
                                                        below to Pay.`
                                                        }
                                                      </em>
                                                    </td>
                                                  </tr>
                                                  ${
                                                    order.user === null &&
                                                    `
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
                                                              href="${constants.frontUrl}pendingpayment/${order._id}"
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
                                                                >Pay Now</span
                                                              >
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>
                                                  `
                                                  }
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Order Details -->
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
`,
  };

  await transporter.sendMail(mailOptions);
};

const sendOrderStatusEmail = async (order) => {
  const orderstatus = order.orderstatus
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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

        .mpb-15 {
          padding-bottom: 15px !important;
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
                                    <div
                                      style="
                                        font-size: 15px;
                                        padding: 5px 50px;
                                        display: flex;
                                        gap: 10px;
                                      "
                                    >
                                      <img style="height: 35px" src="" alt="" />
                                      <h2>Ecom</h2>
                                    </div>
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
                                                style="
                                                  padding-bottom: 50px;
                                                  padding-top: 20px;
                                                "
                                              >
                                                <hr />
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="title-36 a-center pb-15"
                                                      style="
                                                        padding-top: 10px;
                                                        font-size: 25px;
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
                                                        >Order Packed</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <tr>
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
                                                      Hi ${order?.name},
                                                      your order with ${
                                                        order?.items?.length
                                                      } items is
                                                      ${orderstatus}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Intro -->

                                          <!-- Section - Order Details -->
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
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <!-- Button -->
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="btn-20 btn-secondary c-white l-white"
                                                            bgcolor="#f3189e"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              mso-padding-alt: 15px
                                                                35px;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              text-align: center;
                                                              font-weight: bold;
                                                              text-transform: uppercase;
                                                              min-width: auto !important;
                                                              border-radius: 10px;
                                                              background: #ff3f3f;
                                                              color: #ffffff;
                                                            "
                                                          >
                                                            <div
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
                                                                >ORDER
                                                                DETAILS</span
                                                              >
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  class="title-20 pb-10"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 10px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >Shipping
                                                                    details</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 20px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                  "
                                                                >
                                                                  ${
                                                                    order
                                                                      .address
                                                                      .address
                                                                  }, ${
    order.address.city
  }, ${order.address.state}, ${order.address.country}, Pin
                                                                  : ${
                                                                    order
                                                                      .address
                                                                      .postcode
                                                                  }
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-40"
                                                      style="
                                                        padding-bottom: 40px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  ${order.items
                                                    .map(
                                                      (item, index) => `
                                                  <tr key="${index}">
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          >
                                                            <div
                                                              class="fluid-img"
                                                              style="
                                                                font-size: 0pt;
                                                                line-height: 0pt;
                                                                text-align: left;
                                                              "
                                                            >
                                                              <a
                                                                href="#"
                                                                target="_blank"
                                                              >
                                                                <img
                                                                  src="${
                                                                    constants.renderUrl
                                                                  }uploads/product/${
                                                        item.product.thumbnail
                                                      }"
                                                                  border="0"
                                                                  width="230"
                                                                  height="180"
                                                                  alt=""
                                                                />
                                                              </a>
                                                            </div>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  class="title-20 pb-10"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 10px;
                                                                  "
                                                                >
                                                                  <strong>
                                                                    ${
                                                                      item
                                                                        .product
                                                                        .productName
                                                                    }
                                                                  </strong>
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16 lh-26 c-black"
                                                                  style="
                                                                    font-size: 16px;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 26px;
                                                                    color: #282828;
                                                                  "
                                                                >
                                                                  <strong>
                                                                    Qty:
                                                                  </strong>
                                                                  ${
                                                                    item.quantity
                                                                  }
                                                                  <br />
                                                                  <strong>
                                                                    Price:
                                                                  </strong>
                                                                  ₹${
                                                                    item.product
                                                                      .price *
                                                                    item.quantity
                                                                  }
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  `
                                                    )
                                                    .join("")}
                                                  <tr>
                                                    <td
                                                      class="pt-10 pb-40"
                                                      style="
                                                        padding-top: 10px;
                                                        padding-bottom: 40px;
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
                                                            class="img"
                                                            height="1"
                                                            bgcolor="#ebebeb"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          >
                                                            &nbsp;
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pb-30"
                                                      style="
                                                        padding-bottom: 30px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="30"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="230"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
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
                                                                  align="right"
                                                                  class="pb-15"
                                                                  style="
                                                                    padding-bottom: 15px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellspacing="0"
                                                                    cellpadding="0"
                                                                    class="mw-100p"
                                                                  >
                                                                    <tr>
                                                                      <td
                                                                        class="title-20 lh-30 a-right mt-left mw-auto"
                                                                        width="100"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                          text-align: right;
                                                                        "
                                                                      >
                                                                        <strong
                                                                          >Subtotal:</strong
                                                                        >
                                                                      </td>
                                                                      <td
                                                                        class="img mw-15"
                                                                        width="20"
                                                                        style="
                                                                          font-size: 0pt;
                                                                          line-height: 0pt;
                                                                          text-align: left;
                                                                        "
                                                                      ></td>
                                                                      <td
                                                                        class="title-20 lh-30 mt-right"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                        "
                                                                      >
                                                                        &#8377;${
                                                                          order.ordertotal
                                                                        }
                                                                      </td>
                                                                    </tr>
                                                                    <tr>
                                                                      <td
                                                                        class="title-20 lh-30 a-right mt-left"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                          text-align: right;
                                                                        "
                                                                      >
                                                                        <strong
                                                                          >Shipping:</strong
                                                                        >
                                                                      </td>
                                                                      <td
                                                                        class="img mw-15"
                                                                        style="
                                                                          font-size: 0pt;
                                                                          line-height: 0pt;
                                                                          text-align: left;
                                                                        "
                                                                      ></td>
                                                                      <td
                                                                        class="title-20 lh-30 mt-right"
                                                                        style="
                                                                          font-size: 20px;
                                                                          color: #282828;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 30px;
                                                                        "
                                                                      >
                                                                        ₹0.00
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  align="right"
                                                                >
                                                                  <!-- Button -->
                                                                  <table
                                                                    border="0"
                                                                    cellspacing="0"
                                                                    cellpadding="0"
                                                                    class="mw-100p"
                                                                    style="
                                                                      min-width: 200px;
                                                                    "
                                                                  >
                                                                    <tr>
                                                                      <td
                                                                        class="btn-20 btn-secondary c-white l-white"
                                                                        bgcolor="#f3189e"
                                                                        style="
                                                                          font-size: 20px;
                                                                          line-height: 24px;
                                                                          mso-padding-alt: 15px
                                                                            35px;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: center;
                                                                          font-weight: bold;
                                                                          text-transform: uppercase;
                                                                          min-width: auto !important;
                                                                          border-radius: 10px;
                                                                          background: #ff3f3f;
                                                                          color: #ffffff;
                                                                        "
                                                                      >
                                                                        <div
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
                                                                            >TOTAL:
                                                                            ₹${
                                                                              order.ordertotal
                                                                            }</span
                                                                          >
                                                                        </div>
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                  <!-- END Button -->
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Order Details -->
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
    to: order.email,
    subject: `Your Order is ${orderstatus}`,
    html: body,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  createOrder,
  editOrderStatus,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  getOrderByIdAndUserId,
  updatePaymentStatus,
  sendPaymentFailed,
  sendOrderStatusEmail,
};
