import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { axiosInstance } from "../../config";
import useScrollTo from "../../components/useScrollTo";

const ForgotPassword = () => {
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

  const [email, setemail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailsent, setEmailsent] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const forgotpass = async (e) => {
    e.preventDefault();
    // alert("called");
    setLoading(true);
    try {
      const res = await axiosInstance.post("panel/auth/resetpassword", {
        email,
        // role: userrole,
      });
      console.log(res, "res");
      if (res.status === 200) {
        setMessage(
          `Reset your password using the link shared on your mail i.e., ${email}`
        );
        setEmailsent(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setMessage(error.response.data.message);
      } else {
        setMessage(error.response.data.message);
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <Header />
      <main className="login-main">
        <section
          className="register_section sec_ptb_140 d-flex justify-content-center align-items-center vh-100  has_overlay parallaxie clearfix"
          data-background="assets/images/backgrounds/bg_22.jpg"
        >
          <div className="overlay" data-bg-color="rgba(55, 55, 55, 0.75)" />
          <div className="container">
            <div
              className="reg_form_wrap login_form d-flex justify-content-center align-items-center"
              //   data-background="assets/images/reg_bg_01.png"
            >
              <form onSubmit={forgotpass}>
                <div className="reg_form">
                  <h2 className="form_title text-uppercase text-center">
                    Forgot Password
                  </h2>
                  <div className="form_item">
                    <input
                      id="email-input"
                      type="email"
                      name="Email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => {
                        setemail(e.target.value);
                        const atIndex = e.target.value.indexOf("@");
                        const dotIndex = e.target.value.lastIndexOf(".");

                        const isEmailValid =
                          atIndex !== -1 &&
                          dotIndex !== -1 &&
                          dotIndex > atIndex + 1 &&
                          /[a-zA-Z]{2,}$/.test(
                            e.target.value.substring(dotIndex + 1)
                          );

                        setIsValidEmail(isEmailValid);

                        if (e.target.value === "") {
                          setIsValidEmail(true);
                        }
                      }}
                      className={`form-control outline-0 shadow-none ${
                        email !== "" && isValidEmail
                          ? "is-valid"
                          : email !== "" && !isValidEmail
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <label htmlFor="username_input">
                      <i className="far fa-envelope"></i>
                    </label>
                    <div className="invalid-feedback">Enter valid email</div>
                  </div>
                  {message === "We cannot find your email." && (
                    <div className="text-center text-danger py-3 col-12">
                      {message}
                    </div>
                  )}
                  {/* <div className="form_item">
                    <input
                      id="password_input"
                      type="password"
                      name="password"
                      placeholder="password"
                    />
                    <label htmlFor="password_input">
                      <i className="fal fa-unlock-alt" />
                    </label>
                  </div> */}
                  {/* <a className="forget_pass text-uppercase mb_30" href="#!">
                    Forgot password?
                  </a> */}
                  {!loading && !emailsent && (
                    <button
                      className="custom_btn bg_default_red text-uppercase mb_50"
                      type="submit"
                      disabled={!isValidEmail || email === ""}
                    >
                      Send Reset Link
                    </button>
                  )}
                  {loading && (
                    <button
                      type="button"
                      disabled
                      className="custom_btn btn-block bg_default_red text-uppercase mb_50"
                    >
                      Sending Email...
                    </button>
                  )}
                  {emailsent && !loading && (
                    <>
                      {message !== "We cannot find your email." && (
                        <div className="text-center">{message}</div>
                      )}
                      <p className="text-center text-danger">Didn't received email?</p>
                      <button
                        type="submit"
                        disabled={!isValidEmail}
                        className="custom_btn bg_default_red text-uppercase mb_50"
                      >
                        Resend
                      </button>
                    </>
                  )}

                  <div className="create_account text-center">
                    <h4 className="small_title_text text-center text-uppercase">
                      Remember Password?
                    </h4>
                    <Link
                      className="create_account_btn text-uppercase"
                      to="/login"
                    >
                      Login
                    </Link>
                  </div>
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

export default ForgotPassword;
