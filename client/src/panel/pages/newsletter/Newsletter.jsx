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

const Newsletter = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(60);
  const [Letters, setLetters] = useState([]);
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
      const response = await axiosInstance.get(`panel/query/getnewsletters`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setLetters(response.data.data.results);
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
      const modelName = "Newsletter";

      let mongodbQuery;

      let populateOptions = [
        { path: "createdby", model: "Admin" },
        { path: "selectedproducts", model: "Product" },
      ];

      //   if (decoded.role === "superadmin") {
      mongodbQuery = {
        $or: [
          { heading: { $regex: val, $options: "i" } },
          { subject: { $regex: val, $options: "i" } },
          { subheading: { $regex: val, $options: "i" } },
        ],
        //   role: "admin",
      };
      //   }

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
        setLetters(response.data.data);
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
            ]}
          />
          <div className="admin_main container-fluid">
            <div className="admins_table">
              <div className="card table_card border-0 shadow">
                <div className="card-header row mx-0 align-items-sm-center align-items-end border-0">
                  <h6 className="col-md-4 col-12">Newsletters List</h6>
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
                      {(decoded.permissions.includes("Add Newsletter") ||
                        decoded.role === "superadmin") && (
                        <Link
                          to={"/panel_createnewsletter"}
                          className="btn btn-primary"
                        >
                          <small>
                            <i className="fas fa-plus"></i>
                          </small>{" "}
                          Send Newsletter
                        </Link>
                      )}
                      <Link
                        className="btn btn-outline-primary ml-1"
                        to={"/panel_subscribers"}
                      >
                        Subscribers List
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="table_div table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Subject</th>
                        {/* <th >Last</th> */}
                        <th>Created By</th>
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
                        {Letters?.map((admin, index) => (
                          <tr key={admin._id}>
                            <td scope="row">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>
                              <Link
                                to={``}
                                data-toggle="modal"
                                data-target="#newsModal"
                                className="text-panel"
                              >
                                {admin.subject}
                              </Link>
                            </td>
                            <td>
                              {admin?.createdby?.username || "N/A"} <br />{" "}
                              <small>
                                {admin?.createdby?.role === "superadmin"
                                  ? "(Super Admin)"
                                  : admin?.createdby?.role === "admin"
                                  ? "(Admin)"
                                  : ""}
                              </small>
                            </td>
                            {/* <td>{admin.lastName}</td> */}
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
                                    {/* Button trigger modal */}
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-primary"
                                      data-toggle="modal"
                                      data-target="#newsModal"
                                    >
                                      <i class="fas fa-eye"></i>
                                    </button>
                                    {/* Modal */}
                                    <div
                                      className="modal fade"
                                      id="newsModal"
                                      tabIndex={-1}
                                      aria-labelledby="exampleModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog modal-lg">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h5
                                              className="modal-title"
                                              id="exampleModalLabel"
                                            >
                                              Newsletter details
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
                                            <div className="newsletter_details">
                                              <p>
                                                <b>Subject : </b>
                                                {admin?.subject || "N/A"}
                                              </p>
                                              <p>
                                                <b>Heading : </b>
                                                {admin?.heading || "N/A"}
                                              </p>
                                              <p>
                                                <b>Sub Heading : </b>
                                                {admin?.subheading || "N/A"}
                                              </p>
                                              {admin?.images.length > 0 && (
                                                <div className="news_images">
                                                  <p>
                                                    <b>Images : </b>
                                                  </p>
                                                  <div className="d-flex  flex-wrap">
                                                    {admin?.images?.map(
                                                      (img, index) => (
                                                        <div className="news_img mr-3 mb-2">
                                                          <img
                                                            src={`${renderUrl}uploads/newsletter/${img}`}
                                                            alt="img"
                                                          />
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                              <div className="news_cards">
                                                <p>
                                                  <b>Products : </b>
                                                </p>
                                                <div className="d-flex flex-wrap">
                                                  {admin.selectedproducts
                                                    .length > 0 &&
                                                    admin.selectedproducts.map(
                                                      (el, index) => (
                                                        <div
                                                          key={index}
                                                          className="card mb-2 mr-2"
                                                        >
                                                          <div className="card-body">
                                                            <div className="news_card_img">
                                                              <img
                                                                src={`${renderUrl}uploads/product/${el.thumbnail}`}
                                                                alt=""
                                                              />
                                                            </div>
                                                            <p>
                                                              <Link
                                                                className="text-panel"
                                                                to={`/panel_product?pid=${el._id}`}
                                                              >
                                                                <b>
                                                                  {
                                                                    el.productName
                                                                  }
                                                                </b>
                                                              </Link>
                                                            </p>
                                                            <p className="m-0">
                                                              <del>
                                                                &#8377;
                                                                {el.actualPrice}
                                                              </del>{" "}
                                                              <b className="text-panel">
                                                                &#8377;
                                                                {el.price}
                                                              </b>
                                                            </p>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                              </div>
                                              <p>
                                                <b>Button Text : </b>
                                                {admin?.btntext || "N/A"}
                                              </p>
                                              <p>
                                                <b>Button Url : </b>
                                                {admin?.btnurl || "N/A"}
                                              </p>
                                              <p>
                                                <b>Bottom Line Heading : </b>
                                                {admin?.btmheading || "N/A"}
                                              </p>
                                              <p>
                                                <b>Bottom Line Small Text : </b>
                                                {admin?.btmsubheading || "N/A"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
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
                {Letters.length === 0 && (
                  <>
                    <div className="text-center">
                      <small className="text-small">No Products Found</small>
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

export default Newsletter;
