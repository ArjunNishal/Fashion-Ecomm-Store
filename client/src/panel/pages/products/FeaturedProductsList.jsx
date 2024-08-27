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

const FeaturedProductsList = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(60);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setselectedProduct] = useState({});
  const [searchvalue, setsearchvalue] = useState("");
  const [editCatFormData, seteditCatFormData] = useState({
    username: "",
    previousimage: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

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

  const fetchProducts = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(
        `panel/product/featured-products`,
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
      setProducts(response.data.data.results);
      setTotalPages(response.data.data.totalRecord);
      setloading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      fetchProducts();
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
      const modelName = "Product";

      let mongodbQuery;

      let populateOptions = [
        { path: "createdby", model: "Admin" },
        { path: "categories", model: "Category" },
      ];

      //   if (decoded.role === "superadmin") {
      mongodbQuery = {
        $or: [{ productName: { $regex: val, $options: "i" } }],
        featureProduct: 1,
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
        setProducts(response.data.data);
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
      fetchProducts();
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
                url: "/panel_products",
                text: "Products",
              },
              {
                url: "/panel_featureproducts",
                text: "Feature Products",
              },
            ]}
          />
          <div className="admin_main container-fluid">
            <div className="admins_table">
              <div className="card table_card border-0 shadow">
                <div className="card-header row mx-0 align-items-sm-center align-items-end border-0">
                  <h6 className="col-md-4 col-12">Feature Products</h6>
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
                      {(decoded.permissions.includes("Add Product") ||
                        decoded.role === "superadmin") && (
                        <Link
                          to={"/panel_createproduct"}
                          className="btn btn-primary"
                        >
                          <small>
                            <i className="fas fa-plus"></i>
                          </small>{" "}
                          Add Product
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="table_div table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        {/* <th >Last</th> */}
                        <th>Created By</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {!loading && (
                      <tbody>
                        {products?.map((admin, index) => (
                          <tr key={admin._id}>
                            <td scope="row">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>
                              <img
                                className="table_cat_img"
                                src={
                                  admin?.thumbnail
                                    ? `${renderUrl}uploads/product/${admin?.thumbnail}`
                                    : `${renderUrl}uploads/product/${admin?.images[0]}`
                                }
                                alt="product"
                              />
                              <Link
                                to={`/panel_product?pid=${admin._id}`}
                                className="text-panel"
                              >
                                {admin.productName}
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
                            <td>
                              <div>
                                {admin.status === 1 ? (
                                  <span className="badge badge-success">
                                    Active
                                  </span>
                                ) : admin.status === 0 ? (
                                  <span className="badge badge-warning">
                                    Deactivated
                                  </span>
                                ) : (
                                  <span className="badge badge-danger">
                                    Blocked
                                  </span>
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
                                    {admin.status !== 1 && (
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={() =>
                                          toggleSurveyStatus(admin._id, 1)
                                        }
                                      >
                                        <i className="fas fa-circle text-success"></i>{" "}
                                        Activate
                                      </button>
                                    )}
                                    {admin.status !== 0 && (
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={() =>
                                          toggleSurveyStatus(admin._id, 0)
                                        }
                                      >
                                        <i className="fas fa-circle text-warning"></i>{" "}
                                        Deactivate
                                      </button>
                                    )}
                                    {admin.status !== 2 && (
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={() =>
                                          toggleSurveyStatus(admin._id, 2)
                                        }
                                      >
                                        <i className="fas fa-circle text-danger"></i>{" "}
                                        Block
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="text-start">
                                <Link
                                  to={`/panel_editproduct?pid=${admin._id}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="fas fa-pen"></i> Edit
                                </Link>
                              </div>
                            </td>
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
                {products.length === 0 && (
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
                    getproducts={fetchProducts}
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

export default FeaturedProductsList;
