import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { axiosInstance, renderUrl } from "../../../config";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const ProfilePanel = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  // const isadmin = decoded.isAdmin;
  // const isSubAdmin = decoded.isSubAdmin;
  // const id = decoded.id;
  // console.log(isadmin, isSubAdmin, id);
  const fileinputref = React.useRef(null);
  const location = useLocation();
  const [adminProfile, setAdminProfile] = useState(null);
  const [disabled, setdisabled] = useState(true);
  const [sendingemail, setsendingemail] = useState(false);
  const [message, setmessage] = useState("");
  const [editprofilePic, seteditprofilePic] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  const [profileFormData, setprofileFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileno: "",
  });

  const [passwordFormData, setpasswordFormData] = useState({
    oldpassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "mobileno") {
      let inputMobileNo = e.target.value;
      if (inputMobileNo.length > 10) {
        inputMobileNo = inputMobileNo.slice(0, 10);
        // setisvalidmobile(false);
      }
      setprofileFormData({
        ...profileFormData,
        [e.target.name]: inputMobileNo,
      });
    } else if (name === "username") {
      const newValue = value.replace(/\s+/g, "");
      setprofileFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    } else {
      setprofileFormData({
        ...profileFormData,
        [name]: value,
      });
    }
  };

  const handlePassChange = (e) => {
    const { value, name } = e.target;

    if (name === "mobileno") {
      let inputMobileNo = e.target.value;
      if (inputMobileNo.length > 10) {
        inputMobileNo = inputMobileNo.slice(0, 10);
        // setisvalidmobile(false);
      }
      setpasswordFormData({
        ...passwordFormData,
        [e.target.name]: inputMobileNo,
      });
    } else {
      setpasswordFormData({
        ...passwordFormData,
        [name]: value,
      });
    }
  };

  // get profile=====================================================================
  const getAdminProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `panel/user/get/admin/${decoded.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;

      if (data.status) {
        setAdminProfile(data.data);
        const profiledata = data.data;
        setprofileFormData({
          username: profiledata.username,
          firstName: profiledata.firstName,
          lastName: profiledata.lastName,
          email: profiledata.email,
          mobileno: profiledata.mobileno,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to fetch admin profile",
        });
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching admin profile",
      });
    }
  };

  useEffect(() => {
    getAdminProfile();
  }, []);
  //   ===============================================================================
  // change password ===================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldpassword, password, confirmPassword } = passwordFormData;

    if (adminProfile.password !== oldpassword) {
      Swal.fire("Warning", "Current password Incorrect", "warning");
      return;
    }

    if (adminProfile.password === password) {
      Swal.fire(
        "Error",
        "New password cannot be the same as the old password",
        "warning"
      );
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "warning");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `panel/user/resetpassword/${decoded.id}/${token}`,
        {
          password,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        Swal.fire("Success", "Password reset successfully", "success");
        setpasswordFormData({
          oldpassword: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response.data.message, "error");
    }
  };
  //   ===============================================================================

  //   forgot password ====================================
  const forgotpassword = async (e) => {
    e.preventDefault();
    setmessage("");
    setsendingemail(false);
    setsendingemail(true);
    try {
      const response = await axiosInstance.post(
        `panel/user/resetpassword`,
        {
          email: adminProfile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        Swal.fire("Success", "Reset Link sent successfully", "success");
        setsendingemail(false);
        setmessage(response.data.message);
      } else {
        Swal.fire("Error", response.data.message, "error");
        setsendingemail(false);
        setmessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", error.response.data.message, "error");
      setsendingemail(false);
      setmessage(error.response.data.message);
    }
  };
  // ======================================================
  //   edit profile details ====================================
  const editprofile = async (e) => {
    e.preventDefault();
    const { username, firstName, lastName, email, mobileno } = profileFormData;
    if (mobileno.length < 10) {
      return Swal.fire(
        "warning",
        "Please enter a 10 digit mobile number",
        "warning"
      );
    }

    try {
      const response = await axiosInstance.put(
        `panel/user/updateprofile`,
        {
          firstName,
          username,
          lastName,
          email,
          mobileno,
          id: decoded.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        Swal.fire("Success", response.data.message, "success");
        setdisabled(true);
        localStorage.setItem("admin", response.data.token);
        getAdminProfile();
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response.data.message, "error");
    }
  };
  // ==============================================================

  const editprofileImg = async () => {
    try {
      const imagedata = new FormData();
      imagedata.append("image", editprofilePic);
      const response = await axiosInstance.put(
        `panel/user/updateprofileimg`,
        imagedata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", response.data.message, "success");
      seteditprofilePic(null);
      localStorage.setItem("admin", response.data.token);
      getAdminProfile();
    } catch (error) {
      console.log(error);
      Swal.fire("Error", error.response.data.message, "error");
    }
  };

  const canceledit = () => {
    console.log(fileinputref, "fileinputref");
    // fileinputref.current.value = "";
    seteditprofilePic(null);
  };
  const [showpass, setshowpass] = useState(false);
  const [showpass2, setshowpass2] = useState(false);
  const [showpass3, setshowpass3] = useState(false);

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
        <div className="middle profile_middle mt-md-5  mt-0">
          {/* <div className="d-flex adminpage-head justify-content-between align-items-center">
            <PageHeading />
          </div>
          <hr /> */}
          {/* main content */}
          <div className="profile_main">
            <div className="row mx-0">
              {/* top ======================================== */}
              <div className="col-12 profile_top_main_panel">
                <div className="profile_top_panel">
                  <div className="row mx-0">
                    <div className="col-md-4 col-lg-2 col-12 profile_pic_col_panel">
                      <div className="profile_pic_box_panel">
                        <div className="profile_img_panel mb-3">
                          {editprofilePic ? (
                            <img
                              src={URL.createObjectURL(editprofilePic)}
                              alt="img"
                            />
                          ) : (
                            <img
                              src={`${
                                adminProfile?.image
                                  ? `${renderUrl}uploads/profile/${adminProfile?.image}`
                                  : "assets/images/profile.png"
                              }`}
                              alt="img"
                            />
                          )}

                          {!editprofilePic && (
                            <div className="profile_edit_div">
                              <label
                                htmlFor="profile-Pic-panel-input"
                                // onClick={() => {
                                //   seteditprofilePic(true);
                                // }}
                                className="btn p-0 profile_img_edit_btn m-0"
                              >
                                <i className="fas fa-pen"></i>
                              </label>
                              <input
                                ref={fileinputref}
                                id="profile-Pic-panel-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  seteditprofilePic(e.target.files[0]);
                                }}
                                multiple={false}
                                hidden
                              />
                            </div>
                          )}
                          {editprofilePic && (
                            <div className="save_edit_img_div">
                              <div className="text-center">
                                <button
                                  disabled={editprofilePic ? false : true}
                                  onClick={() => editprofileImg()}
                                  className="btn p-0 mx-1 text-panel"
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    canceledit();
                                  }}
                                  className="btn p-0 mx-1 text-danger"
                                >
                                  <i className="fas fa-times-circle"></i>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-8 col-12">
                      <div className="profile_username_panel">
                        <small className="text-capitalize">
                          Hi, {adminProfile?.username}
                        </small>
                        <h3 className="m-0 text-capitalize">
                          {adminProfile?.firstName} {adminProfile?.lastName}
                        </h3>
                        <small>
                          <b>
                            {adminProfile?.role === "superadmin"
                              ? "Super Admin"
                              : "Admin"}
                          </b>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* top end ====================================== */}
              {/* middle */}
              <div className="col-12">
                <hr />
              </div>
              <div className="profile_middle_main col-12">
                <div className="profile_middle_tabs">
                  <div className="row mx-0 flex-lg-row flex-column">
                    <div className="col-lg-2  p-0 col-12 mb-md-0 mb-5">
                      <div
                        className="nav flex-lg-column nav-fill flex-row nav-pills"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <a
                          className="nav-link profile_panel_tabs_link text-lg-left active"
                          id="v-pills-home-tab"
                          data-toggle="pill"
                          href="#v-pills-home"
                          role="tab"
                          aria-controls="v-pills-home"
                          aria-selected="true"
                        >
                          <i className="far fa-user"></i> My Account
                        </a>
                        <a
                          className="nav-link profile_panel_tabs_link text-lg-left"
                          id="v-pills-profile-tab"
                          data-toggle="pill"
                          href="#v-pills-profile"
                          role="tab"
                          aria-controls="v-pills-profile"
                          aria-selected="false"
                        >
                          <i className="fas fa-key"></i> Change Password
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-9 col-12">
                      <div className="tab-content" id="v-pills-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="v-pills-home"
                          role="tabpanel"
                          aria-labelledby="v-pills-home-tab"
                        >
                          <div className="panel_my_account_tab">
                            <div className="card border-0 shadow">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title m-0">My Account</h5>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setdisabled(!disabled);
                                    }}
                                    className="btn border-0 shadow-none text-panel"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                </div>
                              </div>
                              <div className="card-body">
                                <div className="my_account_form">
                                  <form onSubmit={editprofile}>
                                    <div className="row mx-0">
                                      <div className=" col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Username
                                          </label>
                                          <input
                                            type="text"
                                            name="username"
                                            value={profileFormData.username}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={disabled}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className=" col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Firstname
                                          </label>
                                          <input
                                            type="text"
                                            name="firstName"
                                            value={profileFormData.firstName}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={disabled}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className=" col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Lastname
                                          </label>
                                          <input
                                            type="text"
                                            name="lastName"
                                            value={profileFormData.lastName}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={disabled}
                                          />
                                        </div>
                                      </div>
                                      <div className=" col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Email
                                          </label>
                                          <input
                                            type="text"
                                            name="email"
                                            value={profileFormData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={disabled}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className=" col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Mobile Number
                                          </label>
                                          <input
                                            type="text"
                                            name="mobileno"
                                            value={profileFormData.mobileno}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={disabled}
                                            required
                                          />
                                        </div>
                                      </div>
                                      {!disabled && (
                                        <div className="col-12 text-center">
                                          <button
                                            type="submit"
                                            className="btn  btn-primary"
                                            disabled={
                                              profileFormData.username &&
                                              profileFormData.firstName &&
                                              profileFormData.lastName &&
                                              profileFormData.email &&
                                              profileFormData.mobileno
                                                ? false
                                                : true
                                            }
                                          >
                                            Submit
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="v-pills-profile"
                          role="tabpanel"
                          aria-labelledby="v-pills-profile-tab"
                        >
                          <div className="panel_change_pass_tab">
                            <div
                              className="collapse  forgot_pasword_card"
                              id="collapseExample"
                            >
                              <div className="card border-0 shadow mb-5">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                  <h5 className="card-title m-0">
                                    Forgot Password
                                  </h5>
                                  <div>
                                    <button
                                      type="button"
                                      data-toggle="collapse"
                                      data-target="#collapseExample"
                                      aria-expanded="false"
                                      aria-controls="collapseExample"
                                      className="btn border-0 shadow-none text-panel"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="card-body">
                                  <div className="change_pass_form">
                                    <form onSubmit={forgotpassword}>
                                      <div className="row justify-content-center mx-0">
                                        <div className="col-12">
                                          <p>
                                            A link will be sent to your email
                                            i.e., <b>{adminProfile?.email}</b> .
                                            Reset your password using that link,
                                            the link will be valid for 5
                                            minutes.
                                          </p>
                                        </div>
                                        {message && (
                                          <div className="col-12 ">
                                            <p
                                              className={`${
                                                message ===
                                                "Email sent successfully"
                                                  ? "text-success"
                                                  : "text-danger"
                                              }`}
                                            >
                                              {message}
                                            </p>
                                          </div>
                                        )}
                                        <div className="col-12 text-center">
                                          <button
                                            type="submit"
                                            className="btn  btn-primary"
                                            disabled={sendingemail}
                                          >
                                            {sendingemail
                                              ? "...Sending email"
                                              : "Get Link"}
                                          </button>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="card border-0 shadow">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title m-0">
                                  Change Password
                                </h5>
                                <div>
                                  <button
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseExample"
                                    aria-expanded="false"
                                    aria-controls="collapseExample"
                                    className="btn border-0 shadow-none text-panel"
                                  >
                                    Forgot Password?
                                  </button>
                                </div>
                              </div>
                              <div className="card-body">
                                <div className="change_pass_form">
                                  <form onSubmit={handleSubmit}>
                                    <div className="row mx-0">
                                      <div className="col-lg-4 col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Current Password
                                          </label>
                                          {/* <input
                                            type="password"
                                            onChange={handlePassChange}
                                            name="oldpassword"
                                            value={passwordFormData.oldpassword}
                                            className="form-control"
                                            required
                                          ></input>{" "} */}
                                          <div className="input-group password_input_grp mb-3">
                                            <input
                                              type={`${
                                                showpass ? "text" : "password"
                                              }`}
                                              name="oldpassword"
                                              className="form-control border-right-0"
                                              placeholder="Current Password"
                                              aria-label="Password"
                                              aria-describedby="basic-addon2"
                                              value={
                                                passwordFormData.oldpassword
                                              }
                                              onChange={handlePassChange}
                                            />
                                            <div className="input-group-append">
                                              <span
                                                className="input-group-text bg-transparent"
                                                id="basic-addon2"
                                                onClick={() => {
                                                  setshowpass(!showpass);
                                                }}
                                              >
                                                <i
                                                  class={`${
                                                    showpass
                                                      ? "fas fa-eye-slash"
                                                      : "far fa-eye"
                                                  }`}
                                                ></i>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            New Password
                                          </label>
                                          <div className="input-group password_input_grp mb-3">
                                            <input
                                              type={`${
                                                showpass2 ? "text" : "password"
                                              }`}
                                              name="password"
                                              className={`form-control border-right-0 ${
                                                passwordFormData.confirmPassword &&
                                                passwordFormData.password &&
                                                passwordFormData.confirmPassword !==
                                                  passwordFormData.password
                                                  ? "is-invalid"
                                                  : passwordFormData.confirmPassword &&
                                                    passwordFormData.password &&
                                                    passwordFormData.confirmPassword ===
                                                      passwordFormData.password
                                                  ? "is-valid"
                                                  : ""
                                              }`}
                                              placeholder="New Password"
                                              aria-label="Password"
                                              aria-describedby="basic-addon2"
                                              value={passwordFormData.password}
                                              onChange={handlePassChange}
                                            />
                                            <div className="input-group-append">
                                              <span
                                                className="input-group-text bg-transparent"
                                                id="basic-addon2"
                                                onClick={() => {
                                                  setshowpass2(!showpass2);
                                                }}
                                              >
                                                <i
                                                  class={`${
                                                    showpass2
                                                      ? "fas fa-eye-slash"
                                                      : "far fa-eye"
                                                  }`}
                                                ></i>
                                              </span>
                                            </div>
                                          </div>
                                          {/* <input
                                            type="password"
                                            onChange={handlePassChange}
                                            name="password"
                                            required
                                            value={passwordFormData.password}
                                            className={`form-control  ${
                                              passwordFormData.confirmPassword &&
                                              passwordFormData.password &&
                                              passwordFormData.confirmPassword !==
                                                passwordFormData.password
                                                ? "is-invalid"
                                                : passwordFormData.confirmPassword &&
                                                  passwordFormData.password &&
                                                  passwordFormData.confirmPassword ===
                                                    passwordFormData.password
                                                ? "is-valid"
                                                : ""
                                            }`}
                                          ></input> */}
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-6 col-12">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Confirm New Password
                                          </label>
                                          {/* <input
                                            type="password"
                                            onChange={handlePassChange}
                                            name="confirmPassword"
                                            required
                                            value={
                                              passwordFormData.confirmPassword
                                            }
                                            className={`form-control ${
                                              passwordFormData.confirmPassword &&
                                              passwordFormData.password &&
                                              passwordFormData.confirmPassword !==
                                                passwordFormData.password
                                                ? "is-invalid"
                                                : passwordFormData.confirmPassword &&
                                                  passwordFormData.password &&
                                                  passwordFormData.confirmPassword ===
                                                    passwordFormData.password
                                                ? "is-valid"
                                                : ""
                                            }`}
                                          ></input> */}
                                          <div className="input-group password_input_grp mb-3">
                                            <input
                                              type={`${
                                                showpass3 ? "text" : "password"
                                              }`}
                                              name="confirmPassword"
                                              className={`form-control border-right-0  ${
                                                passwordFormData.confirmPassword &&
                                                passwordFormData.password &&
                                                passwordFormData.confirmPassword !==
                                                  passwordFormData.password
                                                  ? "is-invalid"
                                                  : passwordFormData.confirmPassword &&
                                                    passwordFormData.password &&
                                                    passwordFormData.confirmPassword ===
                                                      passwordFormData.password
                                                  ? "is-valid"
                                                  : ""
                                              }`}
                                              placeholder="Confirm New Password"
                                              aria-label="Password"
                                              aria-describedby="basic-addon2"
                                              value={
                                                passwordFormData.confirmPassword
                                              }
                                              onChange={handlePassChange}
                                            />
                                            <div className="input-group-append">
                                              <span
                                                className="input-group-text bg-transparent"
                                                id="basic-addon2"
                                                onClick={() => {
                                                  setshowpass3(!showpass3);
                                                }}
                                              >
                                                <i
                                                  class={`${
                                                    showpass3
                                                      ? "fas fa-eye-slash"
                                                      : "far fa-eye"
                                                  }`}
                                                ></i>
                                              </span>
                                            </div>
                                          </div>
                                          <div className="invalid-feedback"></div>
                                        </div>
                                      </div>

                                      <div className="col-12 text-center">
                                        <button
                                          type="submit"
                                          disabled={
                                            passwordFormData.confirmPassword &&
                                            passwordFormData.password &&
                                            passwordFormData.oldpassword &&
                                            passwordFormData.confirmPassword ===
                                              passwordFormData.password
                                              ? false
                                              : true
                                          }
                                          className="btn  btn-primary"
                                        >
                                          Submit
                                        </button>
                                      </div>
                                    </div>
                                  </form>
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
          </div>
        </div>
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default ProfilePanel;
