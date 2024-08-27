import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import BreadcrumbPanel from "../../components/BreadcrumbPanel";
import PanelPagination from "../../components/PanelPagination";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../../config";
import Swal from "sweetalert2";
// import EditAdmin from "./EditAdmin";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarlinks } from "../../components/dashboardconfig";
import ViewQuery from "./ViewQuery";
import moment from "moment";

const QueryList = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(60);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setselectedAdmin] = useState({});
  const [searchvalue, setsearchvalue] = useState("");
  const [editadminFormdata, seteditadminFormdata] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileno: "",
    password: "",
    permissions: [],
  });

  const navigate = useNavigate("");
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

  const fetchAdmins = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(`panel/query/get/queries`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setAdmins(response.data.data.results);
      setTotalPages(response.data.data.totalRecord);
      setloading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  const toggleSurveyStatus = async (id, activate) => {
    try {
      const response = await axiosInstance.put(
        `panel/query/edit/queries/${id}`,
        {
          status: activate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAdmins();
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
      const modelName = "Query";

      let mongodbQuery;

      let populateOptions = {
        path: "updatedby",
        select: "-password",
      };

      mongodbQuery = {
        $or: [
          { name: { $regex: val, $options: "i" } },
          { email: { $regex: val, $options: "i" } },
          { mobileno: { $regex: val, $options: "i" } },
          { subject: { $regex: val, $options: "i" } },
        ],
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
        setAdmins(response.data.data);
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
      fetchAdmins();
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
        <div className="mt-md-2  mt-0">
          <BreadcrumbPanel
            breadlinks={[
              {
                url: "/panel_dashboard",
                text: "Home",
              },
              {
                url: "/panel_queryList",
                text: "Queries",
              },
            ]}
          />
          <div className="admin_main container-fluid">
            <div className="admins_table">
              <div className="card table_card border-0 shadow">
                <div className="card-header row mx-0 align-items-center border-0">
                  <h6 className="col-md-4 col-12">Queries List</h6>
                  <div className="col-md-8 col-12">
                    <div className="d-flex flex-sm-row flex-column align-items-sm-center align-items-end justify-content-end w-100">
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
                      {/* <CreateAdmin getadmins={fetchAdmins} /> */}
                    </div>
                  </div>
                </div>
                <div className="table_div table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {!loading && (
                      <tbody>
                        {admins?.map((admin, index) => (
                          <tr key={admin._id}>
                            <td scope="row">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>{admin.mobileno}</td>
                            <td>
                              <div className="query_sub_table">
                                {admin.subject}
                              </div>
                            </td>
                            <td>
                              {moment(admin.createdAt).format("Do MMMM YYYY")}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <button
                                  type="button"
                                  className="btn btn-sm mr-1 btn-outline-primary"
                                  data-toggle="modal"
                                  data-target="#editmodalAdmin"
                                  onClick={() => {
                                    setselectedAdmin({});
                                    setselectedAdmin(admin);
                                    seteditadminFormdata({
                                      username: admin?.username,
                                      firstName: admin?.firstName,
                                      lastName: admin?.lastName,
                                      email: admin?.email,
                                      mobileno: admin?.mobileno,
                                      password: admin?.password,
                                      permissions: admin?.permissions,
                                    });
                                  }}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>{" "}
                                <div>
                                  {admin.status === 1 ? (
                                    <span className="badge badge-success">
                                      Active
                                    </span>
                                  ) : admin.status === 0 ? (
                                    <span className="badge badge-danger">
                                      Closed
                                    </span>
                                  ) : (
                                    <span className="badge badge-danger">
                                      Blocked
                                    </span>
                                  )}

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
                                          <i className="fas fa-circle text-danger"></i>{" "}
                                          Close
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
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
                {admins.length === 0 && (
                  <>
                    <div className="text-center">
                      <small className="text-small">No Queries Found</small>
                    </div>
                  </>
                )}
                {selectedAdmin && (
                  <ViewQuery
                    editadminFormdata={editadminFormdata}
                    seteditadminFormdata={seteditadminFormdata}
                    getadmins={fetchAdmins}
                    selectedAdmin={selectedAdmin}
                  />
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

export default QueryList;
