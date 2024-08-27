import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";

const SettingsAccTab = ({ profile, fetchProfile }) => {
  const token = localStorage.getItem("user");
  const decoded = jwtDecode(token);
  const [oldpassword, setoldpassword] = useState("");
  const [NewPass, setNewPass] = useState("");
  const [ConfirmPass, setConfirmPass] = useState("");
  const [Errors, setErrors] = useState({});
  const [sending, setsending] = useState(false);
  const [emailSent, setemailSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.put(
        `auth/client/user/resetpassword/${decoded.id}/${token}`,
        {
          oldpassword: oldpassword,
          password: NewPass,
          confirmPassword: ConfirmPass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setoldpassword("");
        setNewPass("");
        setConfirmPass("");
        fetchProfile();
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      Swal.fire("Error", error.response.data.message, "error");
    }
  };

  const sendlink = async () => {
    try {
      setsending(true);
      setemailSent(false);
      const response = await axiosInstance.post(
        `auth/client/user/resetpassword`,
        {
          email: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setemailSent(true);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
      setsending(false);
    } catch (error) {
      console.error("Error adding review:", error);
      Swal.fire("Error", error.response.data.message, "error");
      setsending(false);
    }
  };

  const [showpass, setshowpass] = useState(false);
  const [showpass2, setshowpass2] = useState(false);
  const [showpass3, setshowpass3] = useState(false);

  return (
    <div>
      <div className="card my_account_card border-0 shadow">
        <div className="card-body">
          <div className="card-title border-bottom border_danger">
            <div className="d-flex justify-content-between align-items-center">
              <h4>Account Settings</h4>

              <button
                type="button"
                data-toggle="collapse"
                data-target="#passwordcollapse2"
                aria-expanded="false"
                aria-controls="passwordcollapse2"
                onClick={() => {
                  setsending(false);
                  setemailSent(false);
                }}
                className="btn btn-outline-danger shadow-none btn-sm border-0"
              >
                forgot password?
              </button>
            </div>
          </div>
          <div className="my_account_form">
            <div className="reg_form_wrap ">
              <div>
                <div className="collapse mb-3 shadow" id="passwordcollapse2">
                  {" "}
                  <div className="card card-body">
                    <div className="card-header bg-transparent">
                      <h6>Forgot Password</h6>
                    </div>
                    <div className="forgot_pass_wrapper">
                      <div className="row mx-0">
                        <div className="col-12">
                          <p>
                            <small>
                              A link will be sent to your email i.e.,{" "}
                              <b>{profile.email}</b> to reset your password.
                            </small>
                          </p>
                        </div>

                        <div className="text-center col-12">
                          {emailSent && (
                            <p className="text-center text-danger">
                              <small>Didn't received Email?</small>
                            </p>
                          )}
                          <button
                            onClick={sendlink}
                            disabled={sending}
                            className="custom_btn bg_sports_red btn_sm rounded"
                          >
                            {sending
                              ? "Sending Email..."
                              : emailSent
                              ? "Resend Link"
                              : "Send Link"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collapse show shadow" id="passwordcollapse1">
                  <div className="card card-body">
                    <div className="card-header bg-transparent">
                      <h6>Change Password</h6>
                    </div>
                    <div className="change_pass_form_wrapper">
                      <form className="p-0" onSubmit={handleSubmit}>
                        <div className="change_pass_form d-flex justify-content-center">
                          <div className="row mx-0 ">
                            <div className="form_item  col-12">
                              {/* <input
                                id="username_input"
                                type="text"
                                name="currentpassword"
                                title="Current password"
                                placeholder="Current password"
                                value={oldpassword}
                                onChange={(e) => {
                                  setoldpassword(e.target.value);
                                }}
                                required
                                className={`form-control shadow-none `}
                              />{" "} */}
                              <div className="input-group password_input_grp mb-3">
                                <input
                                  type={`${showpass ? "text" : "password"}`}
                                  title="Current password"
                                  name="currentpassword"
                                  className="form-control border-right-0 shadow-none"
                                  placeholder="Current password"
                                  aria-label="Password"
                                  aria-describedby="basic-addon2"
                                  value={oldpassword}
                                  onChange={(e) => {
                                    setoldpassword(e.target.value);
                                  }}
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
                              <label htmlFor="username_input">
                                <i class="fas fa-key"></i>
                              </label>
                            </div>
                            <div className="form_item  col-12">
                              {/* <input
                                id="username_input"
                                type="text"
                                name="newpassword"
                                title="New password"
                                placeholder="New password"
                                value={NewPass}
                                onChange={(e) => {
                                  setNewPass(e.target.value);
                                }}
                                required
                                className={`form-control shadow-none ${
                                  ConfirmPass !== NewPass &&
                                  NewPass &&
                                  ConfirmPass
                                    ? "is-invalid"
                                    : ConfirmPass === NewPass &&
                                      NewPass &&
                                      ConfirmPass
                                    ? "is-valid"
                                    : ""
                                }`}
                              /> */}
                              <div className="input-group password_input_grp mb-3">
                                <input
                                  type={`${showpass2 ? "text" : "password"}`}
                                  name="newpassword"
                                  title="New password"
                                  className={`form-control border-right-0  shadow-none ${
                                    ConfirmPass !== NewPass &&
                                    NewPass &&
                                    ConfirmPass
                                      ? "is-invalid"
                                      : ConfirmPass === NewPass &&
                                        NewPass &&
                                        ConfirmPass
                                      ? "is-valid"
                                      : ""
                                  }`}
                                  placeholder="New password"
                                  value={NewPass}
                                  onChange={(e) => {
                                    setNewPass(e.target.value);
                                  }}
                                  aria-label="Password"
                                  aria-describedby="basic-addon2"
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
                              <label htmlFor="username_input">
                                <i class="fas fa-unlock-alt"></i>
                              </label>
                            </div>
                            <div className="form_item  col-12">
                              {/* <input
                                id="username_input"
                                type="text"
                                name="confirmpassword"
                                title="Confirm New password"
                                placeholder="Confirm New password"
                                value={ConfirmPass}
                                onChange={(e) => {
                                  setConfirmPass(e.target.value);
                                }}
                                required
                                className={`form-control shadow-none ${
                                  ConfirmPass !== NewPass &&
                                  NewPass &&
                                  ConfirmPass
                                    ? "is-invalid"
                                    : ConfirmPass === NewPass &&
                                      NewPass &&
                                      ConfirmPass
                                    ? "is-valid"
                                    : ""
                                }`}
                              /> */}
                              <div className="input-group password_input_grp mb-3">
                                <input
                                  type={`${showpass3 ? "text" : "password"}`}
                                  name="confirmpassword"
                                  title="Confirm New password"
                                  className={`form-control shadow-none border-right-0  ${
                                    ConfirmPass !== NewPass &&
                                    NewPass &&
                                    ConfirmPass
                                      ? "is-invalid"
                                      : ConfirmPass === NewPass &&
                                        NewPass &&
                                        ConfirmPass
                                      ? "is-valid"
                                      : ""
                                  }`}
                                  placeholder="Confirm New password"
                                  value={ConfirmPass}
                                  onChange={(e) => {
                                    setConfirmPass(e.target.value);
                                  }}
                                  aria-label="Password"
                                  aria-describedby="basic-addon2"
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
                              <label htmlFor="username_input">
                                <i class="fas fa-lock-alt"></i>
                              </label>
                            </div>
                            <div className="text-center col-12">
                              <button
                                disabled={
                                  NewPass === "" ||
                                  ConfirmPass === "" ||
                                  oldpassword === "" ||
                                  NewPass !== ConfirmPass
                                }
                                className="custom_btn bg_sports_red btn_sm rounded"
                              >
                                Change Password
                              </button>
                            </div>
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
  );
};

export default SettingsAccTab;
