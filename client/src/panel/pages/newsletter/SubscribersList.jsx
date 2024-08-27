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

const SubscribersList = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(60);
  const [Subscribers, setSubscribers] = useState([]);
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
      !decoded.permissions.includes("Manage Newsletter")
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

  const fetchNewsletters = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(
        `panel/newsletter/get/subscribers`,
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setSubscribers(response.data.data.results);
      setTotalPages(response.data.data.totalRecord);
      setloading(false);
    } catch (error) {
      console.error("Error fetching letters:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  const toggleSurveyStatus = async (id, activate) => {
    try {
      const response = await axiosInstance.put(
        `panel/newsletter/edit/subscribe/${id}`,
        {
          subscribed: activate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNewsletters();
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
      const modelName = "Subscriber";

      let mongodbQuery;

      let populateOptions = null;

      mongodbQuery = {
        email: { $regex: val, $options: "i" },
      };

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
        setSubscribers(response.data.data);
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
      fetchNewsletters();
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

        <div className=" mt-md-2  mt-0">
          <BreadcrumbPanel
            breadlinks={[
              {
                url: "/panel_dashboard",
                text: "Home",
              },
              {
                url: "/panel_newsletter",
                text: "Newsletters",
              },
              {
                url: "/panel_subscribers",
                text: "Subscribers List",
              },
            ]}
          />
          <div className="admin_main container-fluid">
            <div className="admins_table">
              <div className="card table_card border-0 shadow">
                <div className="card-header row mx-0 align-items-sm-center align-items-end border-0">
                  <h6 className="col-md-4 col-12">Subscribers List</h6>
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
                        <th>Email</th>
                        {/* <th >Last</th> */}
                        {/* <th></th> */}
                        <th>Date</th>
                        {(decoded.role === "superadmin" ||
                          decoded.permissions.includes(
                            "Manage Newsletter"
                          )) && (
                          <>
                            <th>Action</th>{" "}
                          </>
                        )}
                      </tr>
                    </thead>
                    {!loading && (
                      <tbody>
                        {Subscribers?.map((admin, index) => (
                          <tr key={admin._id}>
                            <td scope="row">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{admin.email}</td>

                            <td>
                              {moment(admin?.createdAt).format("Do MMMM YYYY")}
                            </td>
                            {(decoded.role === "superadmin" ||
                              decoded.permissions.includes(
                                "Manage Newsletter"
                              )) && (
                              <>
                                <td>
                                  <div>
                                    {admin.subscribed === true ? (
                                      <span className="badge badge-success">
                                        Subscribe
                                      </span>
                                    ) : admin.subscribed === false ? (
                                      <span className="badge badge-danger">
                                        UnSubscribed
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                    {/* <button className="btn btn-sm text-secondary">
                                <i className="far fa-edit"></i>
                              </button> */}
                                    <div className="btn-group">
                                      <button
                                        type="button"
                                        className="btn btn-sm text-secondary"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                      >
                                        <i className="far fa-edit"></i>
                                      </button>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        {admin.subscribed === false && (
                                          <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() =>
                                              toggleSurveyStatus(
                                                admin.email,
                                                true
                                              )
                                            }
                                          >
                                            <i className="fas fa-circle text-success"></i>{" "}
                                            Subscribe
                                          </button>
                                        )}
                                        {admin.subscribed === true && (
                                          <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() =>
                                              toggleSurveyStatus(
                                                admin.email,
                                                false
                                              )
                                            }
                                          >
                                            <i className="fas fa-circle text-danger"></i>{" "}
                                            Unsubscribe
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
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
                {Subscribers.length === 0 && (
                  <>
                    <div className="text-center">
                      <small className="text-small">No Subscribers Found</small>
                    </div>
                  </>
                )}
                {/* {selectedProduct && (
                  <EditProduct
                    editCatFormData={editCatFormData}
                    seteditCatFormData={seteditCatFormData}
                    getproducts={fetchNewsletters}
                    selectedProduct={selectedProduct}
                  />
                )} */}

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

export default SubscribersList;
