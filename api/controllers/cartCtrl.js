const { constants } = require("../constants");
const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const { transporter } = require("./emailTransporter");

const findItemIndex = (state, payload) => {
  return state.items.findIndex((item) => {
    if (item.product._id.toString() !== payload.product._id.toString()) {
      return false;
    }
    console.log("matched");

    const sizeMatch =
      payload.size.every((size) => {
        return item.size.some(
          (selectedSize) => selectedSize.sizeId === size.sizeId
        );
      }) &&
      item.size.every((size) => {
        return payload.size.some(
          (selectedSize) => selectedSize.sizeId === size.sizeId
        );
      });

    const colorMatch =
      payload.color.every((color) => {
        return item.color.some(
          (selectedColor) => selectedColor.colorId === color.colorId
        );
      }) &&
      item.color.every((color) => {
        return payload.color.some(
          (selectedColor) => selectedColor.colorId === color.colorId
        );
      });

    return sizeMatch && colorMatch;
  });
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const { color, size, quantity } = req.body;
    const productDetails = req.body.product;
    console.log(req.body, "-------body-------------");
    let cart = await Cart.findOne({ user: req.user });

    const product = await Product.findById(productDetails._id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!cart) {
      cart = new Cart({ user: req.user, items: [] });
    }

    const existingItemIndex = findItemIndex(cart, req.body);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity =
        cart.items[existingItemIndex].quantity + 1;
    } else {
      cart.items.push({
        product: productDetails._id,
        color: color,
        quantity: quantity,
        size: size,
      });
    }

    await cart.save();
    res.status(200).json(cart);

    // setTimeout(() => {
    //   emailnotify(req.user);
    // }, 10 * 1000); // 10 secs

    setTimeout(() => {
      emailnotify(req.user);
    }, 30 * 60 * 1000); // 30 mins
    setTimeout(() => {
      emailnotify(req.user);
    }, 8 * 60 * 60 * 1000); // 8 Hours
    setTimeout(() => {
      emailnotify(req.user);
    }, 24 * 60 * 60 * 1000); // 24 hours 
    setTimeout(() => {
      emailnotify(req.user);
    }, 3 * 24 * 60 * 60 * 1000); // 3days 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.increaseItemQuantity = async (req, res) => {
  try {
    const { color, size, quantity } = req.body;
    const productDetails = req.body.product;

    const cart = await Cart.findOne({ user: req.user });
    const itemIndex = findItemIndex(cart, req.body);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    cart.items[itemIndex].quantity += 1;

    await cart.save();
    res.status(200).json(cart);

    // setTimeout(() => {
    //   emailnotify(req.user);
    // }, 10 * 1000); // 10 secs
    setTimeout(() => {
      emailnotify(req.user);
    }, 30 * 60 * 1000); // 30 mins
    setTimeout(() => {
      emailnotify(req.user);
    }, 8 * 60 * 60 * 1000); // 8 Hours
    setTimeout(() => {
      emailnotify(req.user);
    }, 24 * 60 * 60 * 1000); // 24 hours 
    setTimeout(() => {
      emailnotify(req.user);
    }, 3 * 24 * 60 * 60 * 1000); // 3days 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Decrease item quantity
exports.decreaseItemQuantity = async (req, res) => {
  try {
    const { color, size, quantity } = req.body;
    const productDetails = req.body.product;

    const cart = await Cart.findOne({ user: req.user });
    const itemIndex = findItemIndex(cart, req.body);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // Remove the item from the cart
    }

    await cart.save();
    res.status(200).json(cart);

    // setTimeout(() => {
    //   emailnotify(req.user);
    // }, 10 * 1000); // 10 secs

    setTimeout(() => {
      emailnotify(req.user);
    }, 30 * 60 * 1000); // 30 mins
    setTimeout(() => {
      emailnotify(req.user);
    }, 8 * 60 * 60 * 1000); // 8 Hours
    setTimeout(() => {
      emailnotify(req.user);
    }, 24 * 60 * 60 * 1000); // 24 hours 
    setTimeout(() => {
      emailnotify(req.user);
    }, 3 * 24 * 60 * 60 * 1000); // 3days 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { color, size, quantity } = req.body;
    const productDetails = req.body.product;

    const cart = await Cart.findOne({ user: req.user });
    const itemIndex = findItemIndex(cart, req.body);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    cart.items.splice(itemIndex, 1);

    const savedcart = await cart.save();
    res.status(200).json(savedcart);

    if (savedcart.items.length > 0) {
      // setTimeout(() => {
      //   emailnotify(req.user);
      // }, 10 * 1000);


      setTimeout(() => {
        emailnotify(req.user);
      }, 30 * 60 * 1000); // 30 mins
      setTimeout(() => {
        emailnotify(req.user);
      }, 8 * 60 * 60 * 1000); // 8 Hours
      setTimeout(() => {
        emailnotify(req.user);
      }, 24 * 60 * 60 * 1000); // 24 hours 
      setTimeout(() => {
        emailnotify(req.user);
      }, 3 * 24 * 60 * 60 * 1000); // 3days 
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    // const { userId } = req.body;
    const cart = await Cart.findOne({ user: req.user });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    // const { userId } = req.body;
    let cart = await Cart.findOne({ user: req.user }).populate({
      path: "items.product",
    });

    if (!cart) {
      cart = new Cart({ user: req.user, items: [] });
    }

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ status: true, message: "cart fetched", data: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Error", error });
  }
};

// setTimeout(() => {
//   emailnotify(userId);
// }, 2 * 60 * 60 * 1000); // 2 hours

// setTimeout(() => {
//   emailnotify(userId);
// }, 24 * 60 * 60 * 1000); // 24 hours

// setTimeout(() => {
//   emailnotify(userId);
// }, 3 * 24 * 60 * 60 * 1000); // 3 days

const emailnotify = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    // Check if the cart exists and if 2 hours have passed since the last update
    if (
      cart &&
      cart.items.length > 0 &&
      Date.now() - cart.updatedAt.getTime() >= 1000
    ) {
      sendAbandonedCartEmail(userId, cart);
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
};

const sendAbandonedCartEmail = async (userId, cart) => {
  const user = await User.findById(userId);
  const userEmail = user.email;
  const cartItems = cart.items;
  // console.log(cartItems.map((item, index) => item));
  const subject = "Reminder: Your Cart is Waiting!";

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
                                      <img
                                        style="height: 35px"
                                        src="https://customizehere.in/assets/images/logo/logo.png"
                                        alt=""
                                      />
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
                                                style="padding-bottom: 50px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
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
                                                        >Your cart is
                                                        waiting!</strong
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
                                                      Hi ${user.firstname}, You
                                                      have items in your cart
                                                      that you haven't purchased
                                                      yet. Login to Buy.
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
                                                              href="${
                                                                constants.frontUrl
                                                              }login"
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
                                                                >Login</span
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

                                          <!-- Section - Separator Line -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-50"
                                                style="padding-bottom: 10px"
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
                                          </table>
                                          <!-- END Section - Separator Line -->

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
                                                  <!-- <div> -->
                                                  <h3
                                                    style="
                                                      font-size: 20px;
                                                      text-align: center;
                                                    "
                                                  >
                                                    Cart Items
                                                  </h3>
                                                  <!-- </div> -->
                                                  <tr>
                                                    <td
                                                      class="py-15"
                                                      style="
                                                        border: 1px solid
                                                          #000001;
                                                        border-left: 0;
                                                        border-right: 0;
                                                        padding-top: 15px;
                                                        padding-bottom: 15px;
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
                                                            class="title-20 mw-auto"
                                                            width="200"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              text-align: left;
                                                              min-width: auto !important;
                                                            "
                                                          >
                                                            <strong
                                                              >Item</strong
                                                            >
                                                          </td>
                                                          <td
                                                            class="img"
                                                            width="20"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          ></td>
                                                          <td
                                                            class="title-20 a-center mw-auto"
                                                            width="40"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              min-width: auto !important;
                                                              text-align: center;
                                                            "
                                                          >
                                                            <strong>Qty</strong>
                                                          </td>
                                                          <td
                                                            class="img"
                                                            width="20"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          ></td>
                                                          <td
                                                            class="title-20 a-right mw-auto"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              min-width: auto !important;
                                                              text-align: right;
                                                            "
                                                          >
                                                            <strong
                                                              >Price</strong
                                                            >
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- cart Items -->
                                                  ${cartItems.map(
                                                    (item, itemindex) =>
                                                      `<tr key="${itemindex}" >
                                                    <td
                                                      class="py-25"
                                                      style="
                                                        border-bottom: 1px solid
                                                          #ebebeb;
                                                        padding-top: 25px;
                                                        padding-bottom: 25px;
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
                                                            width="200"
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
                                                                    >${item.product.productName}</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16 lh-24"
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
                                                                ></td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="20"
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
                                                            width="40"
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
                                                                  class="title-20 a-center mt-left"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    min-width: auto !important;
                                                                    text-align: center;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >&times;${item.quantity}</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="20"
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
                                                                  class="title-20 a-right mt-left"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    min-width: auto !important;
                                                                    text-align: right;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >₹${item.product.price}</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>`
                                                  )}
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
    to: userEmail,
    subject: subject,
    html: body,
  };

  await transporter.sendMail(mailOptions);
};
