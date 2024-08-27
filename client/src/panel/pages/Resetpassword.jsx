import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
import useScrollTo from "../../components/useScrollTo";

const Resetpassword = () => {
  useScrollTo();
  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/contactus",
      text: "Contact Us",
    },
  ];
  const [email, setEmail] = useState("");
  const [newpass, setnewpass] = useState("");
  const [confirmpass, setconfirmpass] = useState("");

  const [loading, setLoading] = useState(false);
  //   const { id, token } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const token = params.get("token");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !id) {
      navigate("/");
    }
    const decodedToken = jwtDecode(token);
    setEmail(decodedToken.email);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newpass !== confirmpass) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "Passwords not match",
        });
      }
      const res = await axiosInstance.put(
        `panel/auth/resetpassword/${id}/${token}`,
        {
          password: newpass,
          confirmPassword: confirmpass,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Password reset successfully.",
      }).then(() => {
        navigate("/"); // Redirect to home page
      });
      setLoading(false);
    } catch (error) {
      console.log(error, "error");
      setError(error.response.data.message);
      setLoading(false);
    }
  };
  const [showpass, setshowpass] = useState(false);
  const [showConfirmpass, setshowConfirmpass] = useState(false);
  return (
    <div>
      <Header />
      <main className="login-main">
        <section
          className="register_section d-flex justify-content-center align-items-center vh-100 sec_ptb_140 has_overlay parallaxie clearfix"
          data-background="assets/images/backgrounds/bg_22.jpg"
        >
          <div className="overlay" data-bg-color="rgba(55, 55, 55, 0.75)" />
          <div className="container">
            <div
              className="reg_form_wrap login_form d-flex justify-content-center align-items-center"
              //   data-background="assets/images/reg_bg_01.png"
            >
              <form onSubmit={handleSubmit}>
                <div className="reg_form">
                  <h2 className="form_title text-uppercase text-center">
                    Reset Password
                  </h2>
                  <div className="form_item">
                    {/* <input
                      id="username_input"
                      type="password"
                      name="newpassword"
                      className={`form-control outline-0 shadow-none ${
                        newpass !== "" ? "is-valid" : ""
                      }`}
                      value={newpass}
                      onChange={(e) => setnewpass(e.target.value)}
                      placeholder="New Password"
                    /> */}

                    <div className="input-group password_input_grp mb-3">
                      <input
                        type={`${showpass ? "text" : "password"}`}
                        name="newpassword"
                        className={`form-control outline-0 shadow-none border-right-0 ${
                          newpass !== "" ? "is-valid" : ""
                        }`}
                        placeholder="New Password"
                        aria-label="Password"
                        aria-describedby="basic-addon2"
                        value={newpass}
                        onChange={(e) => setnewpass(e.target.value)}
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
                              showpass ? "fas fa-eye-slash" : "far fa-eye"
                            }`}
                          ></i>
                        </span>
                      </div>
                    </div>
                    <label htmlFor="username_input">
                      <i className="fas fa-unlock"></i>
                    </label>
                  </div>
                  <div className="form_item">
                    {/* <input
                      id="username_input"
                      className={`form-control outline-0 shadow-none ${
                        confirmpass === newpass &&
                        confirmpass !== "" &&
                        newpass !== ""
                          ? "is-valid"
                          : confirmpass !== newpass &&
                            confirmpass !== "" &&
                            newpass !== ""
                          ? "is-invalid"
                          : ""
                      }`}
                      value={confirmpass}
                      onChange={(e) => {
                        setconfirmpass(e.target.value);
                      }}
                      type="password"
                      name="confirmpassword"
                      placeholder="Confirm New Password"
                    />{" "} */}
                    <div className="input-group password_input_grp mb-3">
                      <input
                        type={`${showConfirmpass ? "text" : "password"}`}
                        name="confirmpassword"
                        className={`form-control border-right-0 outline-0 shadow-none ${
                          confirmpass === newpass &&
                          confirmpass !== "" &&
                          newpass !== ""
                            ? "is-valid"
                            : confirmpass !== newpass &&
                              confirmpass !== "" &&
                              newpass !== ""
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Confirm New Password"
                        aria-label="Password"
                        aria-describedby="basic-addon2"
                        value={confirmpass}
                        onChange={(e) => {
                          setconfirmpass(e.target.value);
                        }}
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text bg-transparent"
                          id="basic-addon2"
                          onClick={() => {
                            setshowConfirmpass(!showConfirmpass);
                          }}
                        >
                          <i
                            class={`${
                              showConfirmpass
                                ? "fas fa-eye-slash"
                                : "far fa-eye"
                            }`}
                          ></i>
                        </span>
                      </div>
                    </div>
                    <label htmlFor="username_input">
                      <i className="fas fa-lock"></i>
                    </label>
                    <div className="invalid-feedback">
                      Passwords don't match
                    </div>
                  </div>

                  {/* <a className="forget_pass text-uppercase mb_30" href="#!">
                    Forgot password?
                  </a> */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="custom_btn bg_default_red text-uppercase mb_50"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resetpassword;
