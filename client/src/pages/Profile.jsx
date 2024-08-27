import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import useScrollTo from "../components/useScrollTo";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, renderUrl } from "../config";
import AccountTab from "../components/profile/AccountTab";
import SettingsAccTab from "../components/profile/SettingsAccTab";
import Swal from "sweetalert2";
import OrdersTab from "../components/profile/OrdersTab";

const Profile = () => {
  const [token, settoken] = useState(localStorage.getItem("user"));
  const [decoded, setdecoded] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get("tab");

  useEffect(() => {
    // const token = localStorage.getItem("user");
    // alert(token);
    if (!token) {
      return;
    } else if (token !== (undefined || null || "" || "undefined")) {
      settoken(token);
      const decoded2 = jwtDecode(token);
      setdecoded(decoded2);
    }
  }, [token]);

  useEffect(() => {
    const validTabs = ["myaccountTab", "orderstab", "accountsettings"];
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  console.log(decoded, "==== decoded =====");
  // const selector = "categories-section";
  useScrollTo();

  const [profile, setProfile] = useState({});
  const [ActiveTab, setActiveTab] = useState("myaccountTab");
  const [NewPic, setNewPic] = useState(null);
  const newpicref = React.useRef(null);

  const [loading, setloading] = useState(false);
  // /get/userprofile

  const fetchProfile = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(
        `auth/client/user/get/userprofile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data.data);
      setProfile(response.data.data.user);
      if (response.data.data.token) {
        localStorage.setItem("user", response.data.data.token);
      }

      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadimg = async () => {
    try {
      if (!NewPic) {
        return Swal.fire(
          "Warning",
          "Please select a file to continue",
          "warning"
        );
      }
      setloading(true);

      const imgdata = new FormData();
      imgdata.append("image", NewPic);
      imgdata.append("userId", decoded.id);

      const response = await axiosInstance.put(
        `auth/client/user/upload/img`,
        imgdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setNewPic(null);
        newpicref.current = null;
        fetchProfile();
        setloading(false);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
      setloading(false);
    } catch (error) {
      console.error("Error adding review:", error);
      Swal.fire("Error", error.response.data.message, "error");
      setloading(false);
    }
  };

  return (
    <div>
      <Header />
      {/* <ScrollToTop /> */}
      <main>
        <section className="profile-section">
          <div className="container">
            <div className="profile-container">
              <div className="profile-cover-main">
                <div className="profile-cover">
                  <img src="/assets/images/breadcrumb/bg_14.jpg" alt="cover" />
                </div>
                <div className="profile-cover-bottom">
                  <div className="row mx-0">
                    <div className="col-md-3 col-12">
                      <div className="profile-image">
                        <div className="profile_img_box d-flex justify-content-center">
                          {NewPic ? (
                            <img
                              src={URL.createObjectURL(NewPic)}
                              alt="newpic"
                            />
                          ) : (
                            <img
                              src={`${
                                profile.image
                                  ? `${renderUrl}uploads/profile/${profile.image}`
                                  : "assets/images/profile.png"
                              }`}
                              alt="profile"
                            />
                          )}
                          {!NewPic && (
                            <div className="editprofile_btn_web">
                              <label
                                htmlFor="profilepiclabel"
                                className="btn border-o m-0 shadow-none"
                              >
                                <i class="far fa-camera-retro"></i>
                              </label>
                              <input
                                ref={newpicref}
                                id="profilepiclabel"
                                multiple={false}
                                accept="image/*"
                                onChange={(e) => {
                                  setNewPic(e.target.files[0]);
                                }}
                                type="file"
                                hidden
                              />
                            </div>
                          )}
                          {NewPic && (
                            <>
                              <div className="confirm_newpic_web d-flex justify-content-around align-items-center">
                                <button
                                  onClick={() => {
                                    uploadimg();
                                  }}
                                  className="btn text-success border-0 shadow-none"
                                >
                                  <i class="fas fa-check-circle"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    setNewPic(null);
                                    newpicref.current = null;
                                  }}
                                  className="btn text-danger border-0 shadow-none"
                                >
                                  <i class="fas fa-times-circle"></i>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {loading && (
                        <div class="d-flex w-100 justify-content-center">
                          <div class="spinner-border text-danger" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-md-9 col-12">
                      <div className="profile-username py-3">
                        <small>Welcome!</small>
                        <h4>
                          {profile.firstname} {profile.lastname}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {!loading && (
                <div className="profile-details-container">
                  <div className="row mx-0 flex-md-row flex-column">
                    <div className="col-md-3 col-12">
                      <div
                        className="nav flex-md-column flex-row nav-fill nav-pills"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <Link
                          className={`nav-link text-left ${
                            ActiveTab === "myaccountTab" ? "active" : ""
                          }`}
                          id="myaccou"
                          data-toggle="pill"
                          to="/profile?tab=myaccountTab"
                          role="tab"
                          aria-controls="myaccountTab"
                          onClick={() => {
                            setActiveTab("myaccountTab");
                          }}
                          aria-selected="true"
                        >
                          <span className="d-md-none d-block">
                            <i class="fas fa-user-circle"></i>{" "}
                            {ActiveTab === "myaccountTab" ? " My Account" : ""}
                          </span>
                          <span className="d-md-block d-none">
                            <i class="fas fa-user-circle"></i> My Account
                          </span>
                        </Link>
                        <Link
                          className={`nav-link text-left ${
                            ActiveTab === "orderstab" ? "active" : ""
                          }`}
                          id="orderslinktab"
                          data-toggle="pill"
                          // href="#orderstab"
                          to="/profile?tab=orderstab"
                          onClick={() => {
                            setActiveTab("orderstab");
                          }}
                          role="tab"
                          aria-controls="orderstab"
                          aria-selected="false"
                        >
                          <span className="d-md-none d-block">
                            <i class="fas fa-box-open"></i>{" "}
                            {ActiveTab === "orderstab" ? " Orders" : ""}{" "}
                          </span>
                          <span className="d-md-block d-none">
                            <i class="fas fa-box-open"></i> Orders
                          </span>
                        </Link>
                        <Link
                          className={`nav-link text-left ${
                            ActiveTab === "accountsettings" ? "active" : ""
                          }`}
                          id="accountsettingstablink"
                          to="/profile?tab=accountsettings"
                          onClick={() => {
                            setActiveTab("accountsettings");
                          }}
                          data-toggle="pill"
                          // href="#accountsettings"
                          role="tab"
                          aria-controls="accountsettings"
                          aria-selected="false"
                        >
                          <span className="d-md-none d-block">
                            {" "}
                            <i class="fas fa-user-cog"></i>{" "}
                            {ActiveTab === "accountsettings"
                              ? "Account settings"
                              : ""}{" "}
                          </span>
                          <span className="d-md-block d-none">
                            <i class="fas fa-user-cog"></i> Account settings
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-9 col-12">
                      <div className="tab-content" id="v-pills-tabContent">
                        <div
                          className={`tab-pane fade ${
                            ActiveTab === "myaccountTab" ? "active show" : ""
                          }`}
                          id="myaccountTab"
                          role="tabpanel"
                          aria-labelledby="myaccountTab-tab"
                        >
                          <AccountTab
                            profile={profile}
                            fetchProfile={fetchProfile}
                          />
                        </div>
                        <div
                          className={`tab-pane fade ${
                            ActiveTab === "orderstab" ? "active show" : ""
                          }`}
                          id="orderstab"
                          role="tabpanel"
                          aria-labelledby="orderstab"
                        >
                          <OrdersTab
                            profile={profile}
                            fetchProfile={fetchProfile}
                          />
                        </div>
                        <div
                          className={`tab-pane fade ${
                            ActiveTab === "accountsettings" ? "active show" : ""
                          }`}
                          id="accountsettings"
                          role="tabpanel"
                          aria-labelledby="accountsettings"
                        >
                          <SettingsAccTab
                            profile={profile}
                            fetchProfile={fetchProfile}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {loading && (
                <div class="d-flex w-100 justify-content-center">
                  <div class="spinner-border text-danger" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* product_section - start
			================================================== */}

        {/* product_section - end
			================================================== */}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
