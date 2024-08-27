import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, renderUrl } from "../../config";
import moment from "moment";
import Swal from "sweetalert2";
import { cashfree } from "../../pages/checkout/utils";
import OrderStatus from "../OrderStatus";

const OrdersTab = ({ profile, fetchProfile }) => {
  const token = localStorage.getItem("user");
  const decoded = jwtDecode(token);
  const [Orders, setOrders] = useState([]);
  const [loading, setloading] = useState(false);
  const [Offset, setOffset] = useState(0);
  const [Limit, setLimit] = useState(10);
  const observer = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [totalproducts, settotalproducts] = useState(0);

  const fetchOrders = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(
        `auth/client/order/getorders/user/${decoded.id}?offset=${Offset}&limit=${Limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      //   setOrders(response.data.data.orders);
      setOrders([...Orders, ...response.data.data.orders]);
      setOffset(Offset + Limit);
      setHasMore(response.data.data.orders.length > 0);
      settotalproducts(response.data.data.totalorders);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const lastProductElementRef = (node) => {
    if (loading) return;
    console.log(Offset, "lazy");
    if (!loading) {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // alert(`total products - ${products.length}`);

          fetchOrders();
          // setOffset(products.length + limit);
        }
      });

      if (node) observer.current.observe(node);
    }
  };

  const handleCheckout3 = async (oid) => {
    try {
      //   setIsDisbaled(true);
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
          handleCashfreePayment(getorder.data.data.payment_session_id);
        }
        // setIsDisbaled(false);
        // window.location.href = `https://sandbox.cashfree.com/pgapp/payment/${getorder.data.payment_session_id}`;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      //   setIsDisbaled(false);
      console.error("Error creating checkout session:", error);
    }
  };

  const handleCashfreePayment = (sessionId) => {
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
        // setIsDisbaled(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      //   setIsDisbaled(false);
      console.log(error);
    }
  };

  return (
    <div>
      <div className="card my_account_card border-0 shadow">
        <div className="card-body">
          <div className="card-title border-bottom border_danger">
            <div className="d-flex justify-content-between align-items-center">
              <h4>My Orders</h4>
            </div>
          </div>
          <div className="my_orders_row">
            <div className="row mx-0">
              {Orders.map((el, index) => (
                <div key={index} className="col-12 p-0 mb-2">
                  <div
                    className={`my_order_card card card-body shadow-sm ${
                      el.paymentStatus === true ? "" : "red_order"
                    }`}
                  >
                    <div className="row mx-0">
                      <div className="col-md-3 col-12">
                        <div className="my_order_img text-center">
                          <img
                            src={`${renderUrl}uploads/product/${el?.items[0]?.product?.thumbnail}`}
                            alt="img"
                          />
                        </div>
                      </div>
                      <div className="col-md-9 col-12">
                        <div className="my_order_details">
                          <div className="d-flex mb-2 flex-wrap justify-content-between align-items-center">
                            <h6 className="m-0">
                              {el?.items.map(
                                (item, itemindex) =>
                                  `${item?.product?.productName}${
                                    itemindex + 1 === el?.items?.length
                                      ? ""
                                      : ", "
                                  }`
                              )}
                            </h6>
                            <span
                              className={`badge badge-${
                                el?.orderstatus === "payment_pending" ||
                                el?.paymentStatus === false
                                  ? "danger"
                                  : "success"
                              } rounded-pill`}
                            >
                              {el?.orderstatus === "payment_pending" ||
                              el?.paymentStatus === false
                                ? "Payment Pending"
                                : el.orderstatus === "order_placed"
                                ? "Order Placed"
                                : el?.orderstatus === "packed"
                                ? "Packed"
                                : el?.orderstatus === "confirmed"
                                ? "Confirmed"
                                : el?.orderstatus === "out_for_delivery"
                                ? "Out for Delivery"
                                : el?.orderstatus === "delivered"
                                ? "Delivered"
                                : ""}
                            </span>
                          </div>
                          <p>
                            <b>No. of Products : </b>
                            {el?.items?.length}
                          </p>
                          <p>
                            <b>Order Total : </b>&#8377;{el?.ordertotal}
                          </p>
                          <p>
                            <b>Payment Status : </b>{" "}
                            {el.paymentStatus ? "Paid" : "Pending"}
                          </p>
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <p className="m-0">
                              Date :{" "}
                              {moment(el.createdAt).format(
                                "Do MMMM YYYY, hh:mm:ss a"
                              )}
                            </p>
                            <button
                              type="button"
                              data-toggle="modal"
                              data-target={`#myOrder_${el._id}`}
                              className="btn btn-sm btn-outline-danger"
                            >
                              View Details
                            </button>
                            <div
                              className="modal modal-full fade"
                              id={`myOrder_${el._id}`}
                              tabIndex={-1}
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog ">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5
                                      className="modal-title"
                                      id="exampleModalLabel"
                                    >
                                      Order Details
                                    </h5>
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="modal"
                                      aria-label="Close"
                                    >
                                      <span aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="my_order_modal">
                                      <div className="my_order_items">
                                        <div className="row mx-0">
                                          <div className="col-12">
                                            <h5>Order Items </h5>
                                            <p>
                                              <small>
                                                Order Id : #{el._id}
                                              </small>
                                            </p>
                                          </div>
                                          <div className="orderstatus_div w-100">
                                            <OrderStatus
                                              currentStatus={el.orderstatus}
                                            />
                                          </div>
                                          {el.items.map((item, ItemIndex) => (
                                            <div
                                              key={ItemIndex}
                                              className="col-12"
                                            >
                                              <div className="my_order_item card mb-2 card-body">
                                                <div className="d-flex align-items-center">
                                                  <div className="px-2">
                                                    <div className="my_order_img text-center">
                                                      <img
                                                        src={`${renderUrl}uploads/product/${item.product.thumbnail}`}
                                                        alt="img"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="">
                                                    <div className="my_order_details">
                                                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                        <h6 className="m-0">
                                                          {
                                                            item.product
                                                              .productName
                                                          }
                                                        </h6>
                                                      </div>
                                                      <p>
                                                        <b>Quantity : </b>
                                                        {item.quantity}
                                                      </p>
                                                      <p>
                                                        <b>Total price : </b>
                                                        &#8377;
                                                        {item.product.price *
                                                          item.quantity}
                                                      </p>
                                                      <div className="d-flex flex-wrap">
                                                        {item?.product?.products?.map(
                                                          (
                                                            product,
                                                            prodIndex
                                                          ) => {
                                                            return (
                                                              <div
                                                                key={prodIndex}
                                                                className="order_colors_sizes mr-2 card card-body p-1"
                                                              >
                                                                <p>
                                                                  <b>
                                                                    {
                                                                      product.productName
                                                                    }
                                                                  </b>
                                                                </p>
                                                                {item?.color?.map(
                                                                  (
                                                                    selectedColor,
                                                                    colorIndex
                                                                  ) => {
                                                                    // Find the matching color from the product's colors array
                                                                    const color =
                                                                      product.colors.find(
                                                                        (c) =>
                                                                          c._id ===
                                                                          selectedColor.colorId
                                                                      );

                                                                    console.log(
                                                                      product.colors,
                                                                      selectedColor,
                                                                      "color"
                                                                    );
                                                                    if (color) {
                                                                      return (
                                                                        <p
                                                                          key={
                                                                            colorIndex
                                                                          }
                                                                        >
                                                                          <b>
                                                                            Color:{" "}
                                                                          </b>
                                                                          <i
                                                                            style={{
                                                                              color: `${color.code}`,
                                                                            }}
                                                                            className="fas fa-circle"
                                                                          ></i>{" "}
                                                                          {
                                                                            color.name
                                                                          }
                                                                        </p>
                                                                      );
                                                                    }
                                                                    return null;
                                                                  }
                                                                )}
                                                                {item?.size?.map(
                                                                  (
                                                                    selectedSize,
                                                                    sizeIndex
                                                                  ) => {
                                                                    // Find the matching color from the product's colors array
                                                                    const size =
                                                                      product.sizes.find(
                                                                        (c) =>
                                                                          c._id ===
                                                                          selectedSize.sizeId
                                                                      );

                                                                    console.log(
                                                                      product.colors,
                                                                      selectedSize,
                                                                      "color"
                                                                    );
                                                                    if (size) {
                                                                      return (
                                                                        <p
                                                                          key={
                                                                            sizeIndex
                                                                          }
                                                                        >
                                                                          <b>
                                                                            Size:{" "}
                                                                          </b>

                                                                          {
                                                                            size.fullform
                                                                          }
                                                                        </p>
                                                                      );
                                                                    }
                                                                    return null;
                                                                  }
                                                                )}
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}

                                          <div className="col-12">
                                            <div className="shippingdetails card card-body">
                                              <h6>Shipping Details</h6>
                                              <p>
                                                <b>Shipped To : </b> {el.name}
                                              </p>{" "}
                                              <p>
                                                <b>Mobile No.: </b>{" "}
                                                {el.mobileno}
                                              </p>{" "}
                                              <p>
                                                <b>Email : </b>
                                                {el.email}
                                              </p>{" "}
                                              <p>
                                                <b>Address : </b>{" "}
                                                {el.address.address},{" "}
                                                {el.address.city},{" "}
                                                {el.address.state},{" "}
                                                {el.address.country},{" "}
                                                {el.address.postcode}
                                              </p>
                                              <p>
                                                <b>Order Notes : </b>{" "}
                                                {el.orderNotes}
                                              </p>
                                            </div>
                                            <div className="order_modal_details mt-2 card-body">
                                              <p>
                                                <b>Order Status : </b>{" "}
                                                {el.orderstatus ===
                                                "order_placed"
                                                  ? "Order Placed"
                                                  : el?.orderstatus === "packed"
                                                  ? "Packed"
                                                  : el?.orderstatus ===
                                                    "confirmed"
                                                  ? "Confirmed"
                                                  : el?.orderstatus ===
                                                    "out_for_delivery"
                                                  ? "Out for Delivery"
                                                  : el?.orderstatus ===
                                                    "delivered"
                                                  ? "Delivered"
                                                  : el?.orderstatus ===
                                                      "payment_pending" ||
                                                    el?.paymentStatus === false
                                                  ? "Payment Pending"
                                                  : ""}
                                              </p>
                                              <p>
                                                <b>No. of Products : </b>
                                                {el.items.length}
                                              </p>
                                              <p>
                                                <b>Order total : </b>&#8377;
                                                {el.ordertotal}
                                              </p>
                                              <p>
                                                <b>Date : </b>
                                                {moment(el.createdAt).format(
                                                  " Do MMMM YYYY"
                                                )}
                                              </p>
                                            </div>
                                            {el.paymentStatus === false && (
                                              <div className="payment_status_item">
                                                <div className="d-flex align-items-center justify-content-between">
                                                  <p>
                                                    <b>Payment status : </b>
                                                    {el.paymentStatus !==
                                                      true && "Pending"}
                                                  </p>
                                                  <button
                                                    onClick={() => {
                                                      handleCheckout3(el._id);
                                                    }}
                                                    className="custom_btn bg_sports_red text-uppercase btn_sm"
                                                  >
                                                    Pay Now
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <div className="text-center">
                                      <button
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        className="custom_btn bg_danger"
                                      >
                                        Close
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {totalproducts > Limit && !loading && (
                <div
                  ref={lastProductElementRef}
                  className="col-12 p-0 m-0"
                ></div>
              )}
              {loading && (
                <div className="col-12">
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* modal view order */}
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
