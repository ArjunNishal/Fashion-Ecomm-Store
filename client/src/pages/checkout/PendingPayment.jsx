import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useScrollTo from "../../components/useScrollTo";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { cashfree } from "./utils";

const PendingPayment = () => {
  const { oid } = useParams();
  const selector = "payment-section";

  const [token, settoken] = useState("");
  const [decoded, setdecoded] = useState({});
  useEffect(() => {
    const token = localStorage.getItem("user");
    getorderdetails();
    if (!token) {
      return;
    } else {
      settoken(token);
      const decoded2 = jwtDecode(token);
      setdecoded(decoded2);
    }
  }, []);

  useScrollTo(selector);
  const [isDisbaled, setIsDisbaled] = useState(false);
  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: `/payment/${oid}`,
      text: "Payment",
    },
  ];

  const navigate = useNavigate("");

  const getorderdetails = async () => {
    try {
      const response = await axiosInstance.get(`client/order/getorder/${oid}`);
      console.log(response.data);
      if (response.data.data.paymentStatus === true) {
        Swal.fire({
          icon: "success",
          title: "Payment Done",
          text: "Payment already done for this order.",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // cashfree

  const handleCheckout3 = async (oid) => {
    try {
      setIsDisbaled(true);
      // console.log("handleCheckout3 called");
      const getorder = await axiosInstance.post(
        `payment/initiate/cashfree`,
        { orderId: oid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(getorder.data, "getorder");

      if (getorder.data.status) {
        // console.log(getorder.data.data);
        // setsessionId(getorder.data.payment_session_id);
        if (getorder.data.data.payment_session_id) {
          handleCashfreePayment(getorder.data.data.payment_session_id, oid);
        }
        setIsDisbaled(false);
        // window.location.href = `https://sandbox.cashfree.com/pgapp/payment/${getorder.data.payment_session_id}`;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      setIsDisbaled(false);
      sendpaymentfailed(oid);
      console.error("Error creating checkout session:", error);
    }
  };

  const sendpaymentfailed = async (oid) => {
    try {
      const response = await axiosInstance.post(
        `client/order/sendpaymentFailed/${oid}`,
        {}
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCashfreePayment = (sessionId, oid) => {
    try {
      // console.log("cashfreecheckoutpage fun called");
      if (sessionId) {
        // alert(sessionId);
        let checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        };

        cashfree.checkout(checkoutOptions).then(function (result) {
          // console.log(result);
          if (result.error) {
            alert(result.error.message);
            console.log(result.error);
          }
          if (result.redirect) {
            console.log("redirection");
          }
        });
        setIsDisbaled(false);
      }
    } catch (error) {
      sendpaymentfailed(oid);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      setIsDisbaled(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Header />

      <main>
        {" "}
        <Breadcrumb
          pagename={"Payment"}
          breadcrumbitems={breadlinks}
          backgroundimg={"/assets/images/breadcrumb/bg_14.jpg"}
        />
        <section id={selector} className="payment_section sec_ptb_100">
          <div className="payment_section_main">
            <h4 className="text-center mb-3">Payment gateway</h4>
            <div className="payment_gateway_box">
              <div className="row mx-0 justify-content-center">
                <div className="col-md-4 col-12">
                  <div className="payment_gateway_single">
                    <div className="card card-body shadow">
                      <h5 className="text-center">
                        Pay with <b className="text-payment">Cashfree</b>
                      </h5>
                      <div className="d-flex mb-2 justify-content-center align-items-center">
                        <p className="text-center m-0">Powered by </p>
                        <div className="text-center">
                          <img
                            className="pay-logo"
                            src="https://cashfreelogo.cashfree.com/website/NavFooter/Cashfree-Dark.svg"
                            alt
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => {
                            handleCheckout3(oid);
                          }}
                          className="custom_btn bg_danger"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PendingPayment;
