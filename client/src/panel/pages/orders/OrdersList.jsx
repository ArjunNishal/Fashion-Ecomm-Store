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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sidebarlinks } from "../../components/dashboardconfig";

const OrdersList = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(60);
  const [Orders, setOrders] = useState([]);
  const [selectedProduct, setselectedProduct] = useState({});
  const [searchvalue, setsearchvalue] = useState("");
  const [editCatFormData, seteditCatFormData] = useState({
    username: "",
    previousimage: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      decoded.role !== "superadmin" &&
      !decoded.permissions.includes("Manage Orders")
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(`panel/order/getallorders`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setOrders(response.data.data.results);
      setTotalPages(response.data.data.totalRecord);
      setloading(false);
    } catch (error) {
      console.error("Error fetching Orders:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  const toggleSurveyStatus = async (id, activate) => {
    try {
      const response = await axiosInstance.put(
        `panel/product/editproduct/status/${id}`,
        {
          status: activate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "error",
      });
    }
  };

  const handleSearch = async (val) => {
    try {
      setloading(true);
      const apiUrl = "panel/user/search";
      const modelName = "Order";

      let mongodbQuery;

      let populateOptions = [{ path: "user", model: "User" }];

      //   if (decoded.role === "superadmin") {
      mongodbQuery = {
        $or: [
          {
            name: { $regex: val, $options: "i" },
          },
          {
            email: { $regex: val, $options: "i" },
          },
          {
            mobileno: { $regex: val, $options: "i" },
          },
        ],
        //   role: "admin",
      };
      //   }

      console.log(mongodbQuery, "mongodbQuery");

      const response = await axiosInstance.post(
        apiUrl,
        {
          query: mongodbQuery,
          model: modelName,
          populateOptions: populateOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data, "members search");
        setOrders(response.data.data);
        // setSearchResults(response.data.data);
      } else {
        console.error("Error:", response.data.message);
      }
      setloading(false);
    } catch (error) {
      console.error("Error:", error);
      setloading(false);
    }
  };

  const handlesearchevent = (e) => {
    const value = e.target.value;
    if (value === "") {
      fetchOrders();
    } else if (value !== "" && value) {
      handleSearch(value);
    }
    setsearchvalue(value);
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
            ]}
          />
          <div className="admin_main container-fluid">
            <div className="admins_table">
              <div className="card table_card border-0 shadow">
                <div className="card-header row mx-0 align-items-sm-center align-items-end border-0">
                  <h6 className="col-md-4 col-12">Orders List</h6>
                  <div className="col-md-8 col-12">
                    <div className="d-flex flex-sm-row flex-column align-items-center justify-content-end w-100">
                      <div className="searchform_panel my-sm-0 my-2 mr-sm-1">
                        <div className="search_box">
                          <div className="input-group ">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text border-right-0 bg-transparent"
                                id="basic-addon1"
                              >
                                <i className="fas fa-search"></i>
                              </span>
                            </div>

                            <input
                              type="search"
                              name="search"
                              value={searchvalue}
                              onChange={(e) => {
                                handlesearchevent(e);
                              }}
                              className="form-control border-left-0 shadow-none"
                              placeholder={`Search...`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table_div table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>User Details</th>
                        {/* <th >Last</th> */}
                        <th>Order Details</th>
                        <th>Date</th>
                        {(decoded.role === "superadmin" ||
                          decoded.permissions.includes("Manage Orders")) && (
                          <>
                            {" "}
                            <th>Order Status</th>
                            <th>Action</th>{" "}
                          </>
                        )}
                      </tr>
                    </thead>
                    {!loading && (
                      <tbody>
                        {Orders?.map((admin, index) => (
                          <tr
                            // className={`${
                            //   admin.paymentStatus === false
                            //     ? "table-danger"
                            //     : ""
                            // }`}
                            key={admin._id}
                          >
                            <td scope="row">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>
                              <div>
                                <p className="mb-1">
                                  <i class="fas fa-user"></i> {admin?.name}
                                </p>
                                <p className="mb-1">
                                  <i class="fas fa-envelope"></i> {admin.email}
                                </p>
                                <p className="mb-1">
                                  {" "}
                                  <i class="fas fa-phone-alt"></i>{" "}
                                  {admin.mobileno}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div>
                                <p className="mb-1">Id - {admin?._id}</p>
                                <p className="mb-1">
                                  Items - {admin?.items?.length}
                                </p>
                                <p className="mb-1">
                                  Total: &#8377; {admin?.ordertotal}
                                </p>
                              </div>
                            </td>
                            {/* <td>{admin.lastName}</td> */}
                            <td>
                              {moment(admin?.createdAt).format("Do MMMM YYYY")}
                            </td>
                            {(decoded.role === "superadmin" ||
                              decoded.permissions.includes(
                                "Manage Orders"
                              )) && (
                              <>
                                <td>
                                  <div>
                                    {admin.orderstatus !== "payment_pending" ? (
                                      <span className="badge badge-success">
                                        {admin?.orderstatus ===
                                          "payment_pending" ||
                                        admin?.paymentStatus === false
                                          ? "Payment Pending"
                                          : admin?.orderstatus ===
                                            "order_placed"
                                          ? "Order Placed"
                                          : admin?.orderstatus === "packed"
                                          ? "Packed"
                                          : admin?.orderstatus === "confirmed"
                                          ? "Confirmed"
                                          : admin?.orderstatus ===
                                            "out_for_delivery"
                                          ? "Out for Delivery"
                                          : admin?.orderstatus === "delivered"
                                          ? "Delivered"
                                          : ""}
                                      </span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        Payment Pending
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-start">
                                    <Link
                                      to={`/panel_order?oid=${admin._id}`}
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      <i class="fas fa-eye"></i>
                                    </Link>
                                  </div>
                                </td>{" "}
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
                {loading && (
                  <div className="d-flex justify-content-center py-3">
                    <div className="spinner-border text-panel" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                {Orders.length === 0 && (
                  <>
                    <div className="text-center">
                      <small className="text-small">No Orders Found</small>
                    </div>
                  </>
                )}

                {searchvalue === "" && (
                  <div className="row pagination_row mb-2 mx-0 mt-2">
                    <div className="col-md-6 col-12">
                      <p className="mb-0 pagination_entries">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {itemsPerPage * currentPage > totalPages
                          ? totalPages
                          : itemsPerPage * currentPage}{" "}
                        of {totalPages} Entries
                      </p>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="text-md-right text-center">
                        <PanelPagination
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalItems={totalPages}
                          itemsPerPage={itemsPerPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default OrdersList;
