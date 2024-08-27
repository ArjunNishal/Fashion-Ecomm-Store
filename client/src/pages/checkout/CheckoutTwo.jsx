import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import useScrollTo from "../../components/useScrollTo";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance, renderUrl, stateapitoken } from "../../config";
import { States } from "../../components/States";
import { jwtDecode } from "jwt-decode";
import { cashfree } from "./utils";
import Swal from "sweetalert2";
import { clearCartAPI } from "../../Redux/reducers/cartSlice";

const CheckoutTwo = () => {
  const [token, settoken] = useState("");
  const [decoded, setdecoded] = useState({});
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) {
      return;
    } else {
      settoken(token);
      const decoded2 = jwtDecode(token);
      setdecoded(decoded2);
    }
  }, []);

  useScrollTo();
  const cartData = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate("");

  useEffect(() => {
    if (cartData.items.length === 0) {
      navigate("/cart");
    }
  }, []);

  const [OrderData, setOrderData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postcode: "",
    mobileno: "",
    email: "",
    orderNotes: "",
    items: [],
    ordertotal: "",
    subscribe: true,
  });

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

  const [Subtotal, setSubtotal] = useState(0);
  const [Grandtotal, setGrandtotal] = useState(0);
  const [Discountpercentage, setDiscountpercentage] = useState(0);
  const [DiscountAmt, setDiscountAmt] = useState(0);
  const [couponDiscount, setcouponDiscount] = useState(0);
  const [isDisbaled, setIsDisbaled] = useState(false);
  const [couponvalue, setcouponvalue] = useState("");
  const [coupon, setcoupon] = useState(null);
  const [couponerror, setcouponerror] = useState("");

  const calculatecartValue = () => {
    let subtotalprice = 0;
    let grandprice = 0;
    let discountperc = 0;
    let discount = 0;

    cartData.items.forEach((item) => {
      const itemTotalPrice = item.product.actualPrice * item.quantity;
      const itemGrandPrice = item.product.price * item.quantity;
      const itemDiscountpercentage = item.product.discount * item.quantity;
      const itemDiscountAmt =
        (item.product.actualPrice - item.product.price) * item.quantity;

      subtotalprice += itemTotalPrice;
      grandprice += itemGrandPrice;
      discountperc += itemDiscountpercentage;
      discount += itemDiscountAmt;

      if (coupon) {
        const couponDiscountAmt = (
          (grandprice * coupon.discount) /
          100
        ).toFixed(2);

        grandprice -= parseFloat(couponDiscountAmt);
        setcouponDiscount(couponDiscountAmt);
      }

      grandprice = parseFloat(grandprice).toFixed(2);

      setSubtotal(subtotalprice);
      setGrandtotal(grandprice);
      setDiscountpercentage(discountperc);
      setDiscountAmt(discount);
    });
  };

  useEffect(() => {
    calculatecartValue();
  }, [cartItems, coupon]);

  // create order

  const handlechange = (e) => {
    const { value, name } = e.target;

    if (name === "mobileno") {
      let inputMobileNo = e.target.value.replace(/\D/g, "");
      // setisvalidmobile(true);
      if (inputMobileNo.length > 10) {
        inputMobileNo = inputMobileNo.slice(0, 10);
        // setisvalidmobile(false);
      }

      setOrderData({
        ...OrderData,
        [e.target.name]: inputMobileNo,
      });
    } else {
      setOrderData({
        ...OrderData,
        [name]: value,
      });
    }
  };

  console.log(OrderData, "orderdata");

  const dispatch = useDispatch();

  const getcoupon = async (e) => {
    e.preventDefault();
    try {
      setcouponerror("");
      setcoupon(null);
      const response = await axiosInstance.get(
        `client/offer/get/coupon/${couponvalue}`
      );
      console.log(response.data);
      if (response.data.status === true) {
        setcoupon(response.data.data);
        // calculatecartValue();
        setcouponerror("");
      } else {
        setcouponerror(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setcoupon(null);
      setcouponerror(error.response.data.message);
    }
  };

  const resetCoupon = () => {
    setcoupon(null);
    setcouponerror("");
    setcouponvalue("");
  };

  const createOrder = async (e) => {
    e.preventDefault();
    try {
      let response = null;

      const bodydata = {
        name: OrderData.name,
        address: OrderData.address,
        city: OrderData.city,
        state: OrderData.state,
        country: OrderData.country,
        postcode: OrderData.postcode,
        mobileno: OrderData.mobileno,
        email: OrderData.email,
        orderNotes: OrderData.orderNotes,
        items: cartItems,
        ordertotal: Grandtotal,
        subscribe: OrderData.subscribe,
      };

      if (token) {
        response = await axiosInstance.post(
          `auth/client/order/createorder`,
          bodydata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axiosInstance.post(
          `client/order/createorder`,
          bodydata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response) {
        console.log(response.data, "createorder");
        if (response.data.status === true) {
          const order = response.data.data;
          dispatch(clearCartAPI());
          handleCheckout3(order._id);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "order place failed",
      });
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
          pagename={"Checkout"}
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
              <li className="active">
                <Link to="/checkout">
                  <span>02.</span> Checkout
                </Link>
              </li>
              <li>
                <Link to="/checkout-two">
                  <span>03.</span> Order Completed
                </Link>
              </li>
            </ul>
            <div className="row">
              <div className="col-lg-6">
                <div className="checkout_collapse_content">
                  <div className="wrap_heade">
                    <p className="mb-0">
                      <i className="ti-info-alt" />
                      Have a coupon?{" "}
                      <a
                        className="collapsed"
                        data-toggle="collapse"
                        href="#coupon_collapse"
                        aria-expanded="false"
                      >
                        Click here to enter your code
                      </a>
                    </p>
                  </div>
                  <div
                    id="coupon_collapse"
                    className="collapse_form_wrap collapse"
                  >
                    <div className="card-body">
                      <form onSubmit={getcoupon}>
                        <div className="form_item">
                          <input
                            type="text"
                            name="coupon"
                            onChange={(e) => {
                              setcouponvalue(e.target.value);
                            }}
                            value={couponvalue}
                            placeholder="Coupon Code"
                          />
                        </div>
                        {coupon && (
                          <div className="coupon-applied mb-2 ">
                            <div className="d-flex px-2 justify-content-between">
                              <span>{coupon.code} Coupon Applied</span>
                              <button
                                className="btn btn-sm p-0 border-0"
                                type="button"
                                onClick={resetCoupon}
                              >
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        )}
                        {couponerror && (
                          <div className="p-2 text-danger">{couponerror}</div>
                        )}
                        <button
                          type="submit"
                          // onClick={getcoupon}
                          className="custom_btn bg_default_red"
                        >
                          Apply coupon
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="checkout_form_div">
              <form onSubmit={createOrder}>
                <div className="row mx-0 checkout_form_row">
                  <div className="col-md-7 col-lg-8 checkout_row_left col-12">
                    <div className="billing_form mb_50">
                      <h3 className="form_title mb_30">Billing details</h3>
                      <div>
                        <div className="form_wrap">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form_item">
                                <span className="input_title">
                                  Name<sup>*</sup>
                                </span>
                                <input
                                  type="text"
                                  value={OrderData.name}
                                  name="name"
                                  placeholder="Full Name"
                                  required
                                  onChange={(e) => {
                                    handlechange(e);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form_item">
                            <span className="input_title">
                              Mobile No.<sup>*</sup>
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder="Mobile No."
                              value={OrderData.mobileno}
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              name="mobileno"
                            />
                          </div>
                          <div className="form_item">
                            <span className="input_title">
                              Email Address<sup>*</sup>
                            </span>
                            <input
                              type="email"
                              placeholder="email"
                              required
                              value={OrderData.email}
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              name="email"
                            />
                          </div>

                          <div className="form_item">
                            <span className="input_title">
                              Address<sup>*</sup>
                            </span>
                            <input
                              type="text"
                              required
                              value={OrderData.address}
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              name="address"
                              placeholder="House number and street name"
                            />
                          </div>
                          <div className="form_item">
                            <span className="input_title">
                              City<sup>*</sup>
                            </span>
                            <input
                              type="text"
                              placeholder="City"
                              required
                              value={OrderData.city}
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              name="city"
                            />
                          </div>
                          <div className="form_item">
                            <span className="input_title">
                              State<sup>*</sup>
                            </span>
                            {/* <input
                              type="text"
                              placeholder="State"
                              required
                              value={OrderData.state}
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              name="state"
                            /> */}
                            <select
                              value={OrderData.state}
                              required
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              className="form-control"
                              name="state"
                            >
                              <option value="" disabled>
                                State
                              </option>
                              {States.map((el, index) => (
                                <option key={index} value={el.name}>
                                  {el.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form_item">
                            <span className="input_title">
                              Pin Code<sup>*</sup>
                            </span>
                            <input
                              type="text"
                              placeholder="Pin Code"
                              required
                              value={OrderData.postcode}
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              name="postcode"
                            />
                          </div>
                          <div className="option_select">
                            <span className="input_title">
                              Country<sup>*</sup>
                            </span>
                            <select
                              value={OrderData.country}
                              required
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              className="form-control"
                              name="country"
                            >
                              <option value="India" selected>
                                India
                              </option>
                            </select>
                          </div>

                          <hr />

                          <div className="form_item mb-0">
                            <span className="input_title">
                              Order notes<sup>*</sup>
                            </span>
                            <textarea
                              value={OrderData.orderNotes}
                              onChange={(e) => {
                                handlechange(e);
                              }}
                              name="orderNotes"
                              placeholder="Note about your order, eg. special notes fordelivery."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 col-lg-4  col-12">
                    <div className="checkout_row_right">
                      <div className="cart-table-mobile">
                        <div className="row mx-0">
                          <div className="col-12">
                            <h3
                              style={{ fontSize: "24px" }}
                              className="text-center form_title mb_30"
                            >
                              Your items
                            </h3>
                          </div>
                          {cartData?.items?.map((item, index) => {
                            return (
                              <div key={index} className="col-12 px-0">
                                <div className="cart-table-item card shadow mb-2 p-2">
                                  <div className="row mx-0 align-items-center">
                                    <div className="col-4">
                                      <img
                                        src={`${renderUrl}uploads/product/${item?.product?.thumbnail}`}
                                        className=""
                                        alt="img"
                                      />
                                    </div>
                                    <div className="col-8">
                                      <h6 className="item_title">
                                        <Link
                                          className="text-dark"
                                          to={`/product/${item.product._id}`}
                                        >
                                          {item.product.productName}
                                        </Link>
                                      </h6>
                                      <div>
                                        <span className="price_text">
                                          {" "}
                                          &#8377;{item.product.price}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="price_text">
                                          {" "}
                                          Quantity : {item.quantity}
                                        </span>
                                      </div>
                                      <div className="my-2">
                                        <p className="m-0 ">
                                          Total :{" "}
                                          <b className="text-success">
                                            {" "}
                                            &#8377;
                                            {item.product.price * item.quantity}
                                          </b>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <hr />
                      <ul className="ul_li_block clearfix">
                        <li>
                          <div className="checkbox_item mb-0 pl-0">
                            <label htmlFor="check_payments">
                              <input
                                id="check_payments"
                                checked={OrderData.subscribe}
                                type="checkbox"
                                name="subscribe"
                                onChange={(e) => {
                                  setOrderData({
                                    ...OrderData,
                                    subscribe: e.target.checked,
                                  });
                                }}
                              />
                              Subscribe to our Newsletter
                            </label>
                          </div>
                        </li>
                        {coupon && (
                          <li>
                            <div className="coupon-applied text-center mb-2 ">
                              <div className="d-flex px-2 justify-content-between">
                                <span>{coupon.code} Coupon Applied</span>
                                <button
                                  className="btn btn-sm p-0 border-0"
                                  type="button"
                                  onClick={resetCoupon}
                                >
                                  <i class="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          </li>
                        )}
                      </ul>
                      <div
                        className="cart_pricing_table pt-0 text-uppercase"
                        data-bg-color="#f2f3f5"
                      >
                        <h3
                          className="table_title text-center"
                          data-bg-color="#ededed"
                        >
                          Cart Total
                        </h3>
                        <ul className="ul_li_block clearfix">
                          <li>
                            <span>Subtotal</span> <span>&#8377;{Subtotal}</span>
                          </li>
                          <li>
                            <span>Discount {Discountpercentage}%</span>{" "}
                            <span className="text-danger">
                              - &#8377;{DiscountAmt}
                            </span>
                          </li>
                          {coupon && (
                            <li>
                              <span>
                                Coupon Discount&nbsp;
                                {coupon.discount}%
                              </span>{" "}
                              <span className="text-danger">
                                - &#8377;{couponDiscount}
                              </span>
                            </li>
                          )}
                          <li>
                            <span>Total</span> <span>&#8377;{Grandtotal}</span>
                          </li>
                        </ul>
                        <button type="submit" className="custom_btn bg_success">
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutTwo;
