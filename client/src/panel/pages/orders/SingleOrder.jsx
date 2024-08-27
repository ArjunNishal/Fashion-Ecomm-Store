import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import PageHeading from "../../components/PageHeading";
import BreadcrumbPanel from "../../components/BreadcrumbPanel";
import PanelPagination from "../../components/PanelPagination";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, renderUrl } from "../../../config";
import Swal from "sweetalert2";
// import CreateProduct from "./CreateProduct";
// import EditProduct from "./EditProduct";
import moment from "moment";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { sidebarlinks } from "../../components/dashboardconfig";
import OrderStatus from "../../../components/OrderStatus";
import Select from "react-select";

const SingleOrder = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [updating, setupdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [Order, setOrder] = useState(false);
  const [orderstatustate, setorderstatustate] = useState("");
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  const location = useLocation();
  const navigate = useNavigate("");
  const searchParams = new URLSearchParams(location.search);
  const oid = searchParams.get("oid");

  const orderstatusOptions = [
    { value: "order_placed", label: "Order Placed" },
    { value: "packed", label: "Packed" },
    { value: "confirmed", label: "Confirmed" },
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
    },
    { value: "delivered", label: "Delivered" },
    {
      value: "payment_pending",
      label: "Payment Pending",
      isDisabled: true,
    },
  ];

  useEffect(() => {
    if (!oid || oid === ("" || " ") || oid === undefined) {
      navigate(-1);
    }
  }, []);

  useEffect(() => {
    const page = sidebarlinks.find((el) => el.url === location.pathname);

    if (
      decoded.role !== "superadmin" &&
      !page.permission.some((el) => decoded.permissions.includes(el))
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

  const fetchOrder = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(`panel/order/getorder/${oid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setOrder(response.data.data);

      const selectoption = orderstatusOptions.find(
        (option) => option.value === response.data.data.orderstatus
      );

      setorderstatustate(selectoption);
      setloading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [oid]);

  const handleSelectChange = async (selectedOption, actionMeta) => {
    // setorderstatustate(selectedOption);

    try {
      setupdating(true);
      const response = await axiosInstance.put(
        `panel/order/edit-status`,
        {
          orderId: oid,
          status: selectedOption.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setOrder(response.data.data);

      const selectoption = orderstatusOptions.find(
        (option) => option.value === response.data.data.orderstatus
      );

      setorderstatustate(selectoption);
      setupdating(false);
      Swal.fire({
        icon: "success",
        title: "Updated Order status",
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      setupdating(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "error",
      });
    }
  };

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ========= right pane =========*/}
      <div
        className={`main dashboard-main container-fluid ${
          isOpen ? "open" : ""
        }`}
        style={{ right: "0px" }}
        id="upload-div"
      >
        {/* =========topbar ========= */}
        <Topbar />
        {/*========== only admin =========== */}
        <div className=" mt-md-2  mt-0">
          <BreadcrumbPanel
            breadlinks={[
              {
                url: "/panel_dashboard",
                text: "Home",
              },
              {
                url: "/panel_orders",
                text: "Orders",
              },
              {
                url: `/panel_order/${oid}`,
                text: "Order",
              },
            ]}
          />
          <div className="order_details_main">
            <div className="order_details_inner">
              {!loading && (
                <div className="card card-body">
                  <div className="card-header">
                    <h6>Order id: #{oid}</h6>
                  </div>
                  <div className="order_status ">
                    <div className="changestatus container pt-2">
                      <div className="">
                        <h5>Order status</h5>
                        {!updating && (
                          <Select
                            name="orderstatus"
                            onChange={handleSelectChange}
                            label={orderstatustate.label}
                            placeholder="Select..."
                            // value={productForm.type}
                            value={orderstatustate}
                            options={[
                              {
                                value: "order_placed",
                                label: "Order Placed",
                                isDisabled: true,
                              },
                              {
                                value: "confirmed",
                                label: "Confirmed",
                                isDisabled:
                                  Order.orderstatus === "packed"
                                    ? false
                                    : Order.orderstatus === "confirmed"
                                    ? true
                                    : Order.orderstatus === "out_for_delivery"
                                    ? false
                                    : Order.orderstatus === "delivered"
                                    ? false
                                    : Order.orderstatus === "payment_pending"
                                    ? true
                                    : Order.orderstatus === "order_placed"
                                    ? false
                                    : "",
                              },
                              {
                                value: "packed",
                                label: "Packed",
                                isDisabled:
                                  Order.orderstatus === "packed"
                                    ? true
                                    : Order.orderstatus === "confirmed"
                                    ? false
                                    : Order.orderstatus === "out_for_delivery"
                                    ? false
                                    : Order.orderstatus === "delivered"
                                    ? false
                                    : Order.orderstatus === "payment_pending"
                                    ? true
                                    : true,
                              },

                              {
                                value: "out_for_delivery",
                                label: "Out for Delivery",
                                isDisabled:
                                  Order.orderstatus === "packed"
                                    ? false
                                    : Order.orderstatus === "confirmed"
                                    ? true
                                    : Order.orderstatus === "out_for_delivery"
                                    ? true
                                    : Order.orderstatus === "delivered"
                                    ? false
                                    : Order.orderstatus === "payment_pending"
                                    ? true
                                    : Order.orderstatus === "order_placed"
                                    ? true
                                    : "",
                              },
                              {
                                value: "delivered",
                                label: "Delivered",
                                isDisabled:
                                  Order.orderstatus === "packed"
                                    ? true
                                    : Order.orderstatus === "confirmed"
                                    ? true
                                    : Order.orderstatus === "out_for_delivery"
                                    ? false
                                    : Order.orderstatus === "delivered"
                                    ? true
                                    : Order.orderstatus === "payment_pending"
                                    ? true
                                    : Order.orderstatus === "order_placed"
                                    ? true
                                    : "",
                              },
                              {
                                value: "payment_pending",
                                label: "Payment Pending",
                                isDisabled: true,
                              },
                            ]}
                          />
                        )}
                        {updating && (
                          <>
                            <div className="d-flex py-3 justify-content-center">
                              <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                              <br />
                            </div>
                            <p className="text-center">
                              Updating order status...
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <OrderStatus currentStatus={Order.orderstatus} />
                  </div>
                  <div className="order_details_inner_wrapper">
                    <div className="py-3 order_details_items">
                      <div className="row mx-0">
                        <div className="col-12">
                          <h6>Order Items</h6>
                        </div>
                        {Order?.items?.map((item, index) => {
                          return (
                            <div key={index} className="col-12 ">
                              <div className="card">
                                <div className="card-body">
                                  <p>
                                    <b>
                                      {index + 1}.{" "}
                                      <Link className="text-panel" to={``}>
                                        {item.product.productName}
                                      </Link>
                                    </b>
                                  </p>
                                  <p>Product Images</p>
                                  <div className="d-flex flex-wrap mb-3">
                                    {item.product.images.map(
                                      (img, Imgindex) => (
                                        <div
                                          key={Imgindex}
                                          className="order_details_productimg"
                                        >
                                          <img
                                            src={`${renderUrl}uploads/product/${img}`}
                                            alt="product-img"
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>

                                  <div className="d-flex flex-wrap">
                                    <p className="mr-5">
                                      Item Price :{" "}
                                      <b className="text-success">
                                        &#8377; {item.product.price}
                                      </b>
                                    </p>

                                    <p className="mr-5">
                                      Quantity Ordered : <b>{item.quantity}</b>
                                    </p>

                                    <p className="mr-5">
                                      Total Price of item:{" "}
                                      <b>
                                        {item.quantity} x {item.product.price} =
                                        &#8377;
                                        {item.product.price * item.quantity}
                                      </b>
                                    </p>
                                  </div>

                                  <div className="d-flex flex-wrap">
                                    {item?.product?.products.map(
                                      (prod, proIndex) => {
                                        const itemColor = item.color.find(
                                          (cl) => cl.id === prod._id
                                        );
                                        const itemSize = item.size.find(
                                          (cl) => cl.id === prod._id
                                        );

                                        console.log(itemColor, itemSize);

                                        return (
                                          <div
                                            key={proIndex}
                                            className="order_item_sizes mr-3"
                                          >
                                            <div className="card">
                                              <div className="card-body">
                                                <p className="m-0 text-panel">
                                                  <b>{prod.productName}</b>
                                                </p>
                                                <p className="m-0">
                                                  <b>Color : </b>
                                                  <i
                                                    style={{
                                                      color: `${itemColor.code}`,
                                                    }}
                                                    class="fas fa-circle"
                                                  ></i>{" "}
                                                  {itemColor.name}
                                                </p>
                                                <p className="m-0">
                                                  <b>Size : </b>
                                                  {itemSize.shortform} (
                                                  {itemSize.fullform})
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <hr />
                    <div className="order_basic_details d-flex flex-wrap col-12">
                      <p className="mr-5">
                        <b>Order Total : </b>
                        <b className="text-panel">&#8377;{Order?.ordertotal}</b>
                      </p>
                      <p className="mr-5">
                        <b>Total items : </b>
                        {Order?.items?.length}
                      </p>
                      <p className="mr-5">
                        <b>Date : </b>
                        {moment(Order?.createdAt).format(
                          "Do MMMM YYYY , hh:mm a"
                        )}
                      </p>
                    </div>
                    <hr />
                    <div className="order_shipping_details col-12">
                      <h5>Shipping Details</h5>
                      <p className="">
                        <b>To : </b>
                        {Order?.name}
                      </p>
                      <p className="">
                        <b>Email : </b>
                        {Order?.email}
                      </p>
                      <p className="">
                        <b>Mobile : </b>
                        {Order?.mobileno}
                      </p>
                      <p className="">
                        <b>Address : </b>
                        {Order?.address?.address}, {Order?.address?.city},{" "}
                        {Order?.address?.state}, {Order?.address?.country}, PIN
                        : {Order?.address?.postcode}
                      </p>
                      <p className="">
                        <b>Order Notes : </b>
                        {Order?.orderNotes || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {loading && (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default SingleOrder;
