const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../../models/OrderSchema");
const { constants } = require("../../constants");

router.post("/initiate/cashfree", async (req, res) => {
  try {
    const { orderId } = req.body;
    const Orderdetails = await Order.findById(orderId).populate("user");

    console.log(Orderdetails, orderId, "Order details fetched");

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": `${process.env.CASHFREE_APP_ID}`,
      "x-client-secret": `${process.env.CASHFREE_SECRET_KEY}`,
    };

    console.log(headers, "Headers");

    var clientTxnId =
      new Date().getTime().toString() + Math.floor(Math.random() * 1000);

    const redirecturl = `${constants.frontUrl}checkout-three?order_id=${Orderdetails._id}&gateway=cashfree&cashfreeorderid=${clientTxnId}`;
    const payload = {
      order_id: clientTxnId,
      order_amount: Orderdetails.ordertotal,
      customer_details: {
        customer_id: Orderdetails._id,
        customer_name: Orderdetails.name, // Ensure you are fetching correct details
        customer_email: Orderdetails.email,
        customer_phone: Orderdetails.mobileno,
      },
      order_currency: "INR",
      order_meta: {
        return_url: redirecturl,
      },
    };

    console.log(payload, "Payload");

    const url =
      process.env.CASHFREE_ENV === "api"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    axios
      .post(url, payload, { headers })
      .then((response) => {
        console.log("Order Created successfully:", response.data);
        return res.status(200).send({
          status: true,
          message: "order created",
          data: response.data,
        });
      })
      .catch((error) => {
        console.log(error);

        return res
          .status(500)
          .send({ status: false, message: "failed", error });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "failed", error });
  }
});

router.post("/cashfree/status/:orderid", async (req, res) => {
  try {
    const { orderid } = req.params;

    const options = {
      method: "GET",
      url: `https://${process.env.CASHFREE_ENV}.cashfree.com/pg/orders/${orderid}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": `${process.env.CASHFREE_APP_ID}`,
        "x-client-secret": `${process.env.CASHFREE_SECRET_KEY}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        return res.status(200).send({
          status: true,
          message: "order fetched",
          data: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
        return res.status(200).send({
          status: false,
          message: "failed",
          error,
        });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "failed", error });
  }
});

module.exports = router;
