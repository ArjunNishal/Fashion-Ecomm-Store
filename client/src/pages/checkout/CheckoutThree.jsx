import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import useScrollTo from "../../components/useScrollTo";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../config";
import { clearCartAPI } from "../../Redux/reducers/cartSlice";
import Swal from "sweetalert2";
import OrdersTab from "../../components/profile/OrdersTab";

const CheckoutThree = () => {
  const cartData = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const token = localStorage.getItem("user");
  const urlParams = new URLSearchParams(window.location.search);
  const OrderId = urlParams.get("order_id");
  const paymentType = urlParams.get("gateway");
  const [payDone, setpayDone] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [Loading, setLoading] = useState(false);

  const effectCalled = useRef(false);

  useEffect(() => {
    if (cartData.items.length === 0 && !OrderId) {
      navigate("/cart");
    }
  }, [cartData.items.length, OrderId, navigate]);

  useScrollTo();

  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/checkout",
      text: "Checkout",
    },
  ];

  const dispatch = useDispatch();

  const handleUpdatePaymentStatus = async () => {
    try {
      setLoading(true);
      setpayDone(false);
      setPaymentProcessed(false);
      if (paymentType === "cashfree") {
        const cashfreeorderid = urlParams.get("cashfreeorderid");
        console.log(cashfreeorderid, "cashfreeorderid");

        const response = await axiosInstance.post(
          `payment/cashfree/status/${cashfreeorderid}`
        );
        console.log(response.data);
        if (response.data.data.order_status === "PAID") {
          await paymentdone();
          setpayDone(true);
          setLoading(false);
        } else {
          setLoading(false);
          setpayDone(false);
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Payment Failed, please try again",
          });
          // navigate("/profile?tab=orderstab");
          sendpaymentfailed(OrderId);
        }
      }
      setPaymentProcessed(true);
    } catch (error) {
      setLoading(false);
      setPaymentProcessed(true);
      setpayDone(false);
      console.error("Error updating payment status:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      sendpaymentfailed(OrderId);
    }
  };

  const paymentdone = async () => {
    try {
      // alert("payment done");
      let response;
      if (token) {
        response = await axiosInstance.put(
          `auth/client/order/updatePaymentStatus/${OrderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axiosInstance.put(
          `client/order/updatePaymentStatus/${OrderId}`
        );
      }

      if (response.status === 200) {
        localStorage.removeItem("formData");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Payment done successfully",
        });
        // sendpaymentfailed(OrderId);
      }
      setPaymentProcessed(true);
      setLoading(false);
    } catch (error) {
      setPaymentProcessed(true);
      setLoading(false);
      console.error("Error updating payment status:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      sendpaymentfailed(OrderId);
    }
  };

  useEffect(() => {
    if (OrderId && !effectCalled.current) {
      handleUpdatePaymentStatus();
      effectCalled.current = true;
    }
  }, [OrderId, paymentType]);

  const sendpaymentfailed = async (oid) => {
    try {
      // alert("failed called");
      const response = await axiosInstance.post(
        `client/order/sendpaymentFailed/${oid}`,
        {}
      );

      console.log(response.data);
      if (token) {
        navigate("/profile?tab=orderstab");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <Breadcrumb
          pagename={"Order Placed!"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        <section className="checkout_section sec_ptb_140 clearfix">
          <div className="container">
            <ul className="checkout_step ul_li clearfix">
              <li className="activated">
                <Link to="/cart">
                  <span>01.</span> Shopping Cart
                </Link>
              </li>
              <li className="activated">
                <Link to="/checkout">
                  <span>02.</span> Checkout
                </Link>
              </li>
              <li className="active">
                <Link to="/checkout-two">
                  <span>03.</span> Order Completed
                </Link>
              </li>
            </ul>
            {paymentProcessed && (
              <div className="order_complete_alart text-center">
                {payDone ? (
                  <div>
                    <h2>
                      Congratulation! Your Order is <strong>Placed</strong>.
                    </h2>
                    <p className="my-3" >You will be receiving emails for order updates.</p>
                    {token && (
                      <div className="text-center my-2">
                        <Link
                          to={"/profile?tab=orderstab"}
                          type="button"
                          className="custom_btn bg_default_red"
                        >
                          View Order
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2 className="mb-3">Payment Failed</h2>
                    <Link
                      className="custom_btn bg_danger"
                      to={`/payment/${OrderId}`}
                    >
                      Retry Payment
                    </Link>
                  </div>
                )}
              </div>
            )}
            {Loading && (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutThree;
