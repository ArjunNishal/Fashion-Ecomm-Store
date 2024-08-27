import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import useScrollTo from "../components/useScrollTo";
import axios from "axios";
import Swal from "sweetalert2";
import { axiosInstance } from "../config";
import { useDispatch } from "react-redux";
import { addToCartAPI, fetchCartDetails } from "../Redux/reducers/cartSlice";

const Login = () => {
  useScrollTo();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Error, setError] = useState("");

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, password } = formData;

    if (!username || !password) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("client/auth/login", {
        username,
        password,
      });

      if (response.data.status) {
        // Swal.fire("Success", response.data.message, "success");
        console.log(response.data.data);
        localStorage.setItem("user", response.data.data.token);
        dispatch(fetchCartDetails());

        navigate("/");
      } else {
        Swal.fire("Error", response.data.message, "error");
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      Swal.fire(
        "Error",
        error.response ? error.response.data.message : "Login failed",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const [showpass, setshowpass] = useState(false);

  return (
    <div>
      <Header />
      <main className="login-main">
        <section
          className="register_section sec_ptb_140 has_overlay parallaxie clearfix"
          data-background="assets/images/backgrounds/bg_22.jpg"
        >
          <div className="overlay" data-bg-color="rgba(55, 55, 55, 0.75)" />
          <div className="container">
            <div className="reg_form_wrap login_form d-flex justify-content-center align-items-center">
              <form onSubmit={handleSubmit}>
                <div className="reg_form registeration_form">
                  <h2 className="form_title text-uppercase text-center">
                    Login
                  </h2>
                  <div className="form_item">
                    <input
                      id="username_input"
                      type="text"
                      name="username"
                      placeholder="Email / Mobile"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                    <label htmlFor="username_input">
                      <i className="fal fa-user" />
                    </label>
                  </div>
                  <div className="form_item">
                    {/* <input
                      id="password_input"
                      type="password"
                      name="password"
                      placeholder="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="form-control"
                    /> */}
                    <div className="input-group password_input_grp mb-3">
                      <input
                        type={`${showpass ? "text" : "password"}`}
                        name="password"
                        className="form-control border-right-0"
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon2"
                        value={formData.password}
                        onChange={handleChange}
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
                    <label htmlFor="password_input">
                      <i className="fal fa-unlock-alt" />
                    </label>
                  </div>
                  {Error && (
                    <div>
                      <p className="text-danger" >{Error}</p>
                    </div>
                  )}
                  <Link
                    className="forget_pass text-uppercase mb_30"
                    to="/forgotpassword"
                  >
                    Forgot password?
                  </Link>
                  <button
                    type="submit"
                    className="custom_btn bg_default_red text-uppercase mb_50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                  <div className="create_account text-center">
                    <h4 className="small_title_text text-center text-uppercase">
                      Have no account yet?
                    </h4>
                    <Link
                      className="create_account_btn text-uppercase"
                      to="/register"
                    >
                      Sign Up
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

export default Login;
