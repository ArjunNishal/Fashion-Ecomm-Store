import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import useScrollTo from "../components/useScrollTo";
import axios from "axios";
import Swal from "sweetalert2";
import { axiosInstance } from "../config";

const Register = () => {
  useScrollTo();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    // username: "",
    email: "",
    mobileno: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "mobileno") {
      let inputMobileNo = e.target.value.replace(/\D/g, "");
      // setisvalidmobile(true);
      if (inputMobileNo.length > 10) {
        inputMobileNo = inputMobileNo.slice(0, 10);
        // setisvalidmobile(false);
      }

      setFormData({
        ...formData,
        [e.target.name]: inputMobileNo,
      });
    }

    // Validate username for spaces
    // if (name === "username") {
    //   const newValue = value.replace(/\s+/g, "");
    //   setFormData((prevFormData) => ({
    //     ...prevFormData,
    //     [name]: newValue,
    //   }));
    //   return;
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing inputs
    if (
      Object.values(formData).some((value) => value === "" || value === false)
    ) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    // Check for password match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }
    if (!isFormValid()) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("client/auth/signup", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        // username: formData.username,
        email: formData.email,
        mobileno: formData.mobileno,
        password: formData.password,
      });

      if (response.data.status) {
        Swal.fire("Success", response.data.message, "success");
        localStorage.setItem("user", response.data.token);
        navigate("/");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire(
        "Error",
        error.response ? error.response.data.message : "Registration failed",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstname &&
      // formData.username &&
      formData.email &&
      formData.mobileno &&
      formData.password &&
      formData.confirmPassword &&
      formData.agree &&
      formData.confirmPassword === formData.password
    );
  };
  const [showpass, setshowpass] = useState(false);

  return (
    <div>
      <Header />
      <main className="login-main">
        <section
          className="register_section sec_ptb_140 parallaxie clearfix"
          data-background="assets/images/backgrounds/bg_23.jpg"
        >
          <div className="container">
            <div className="reg_form_wrap signup_form d-flex justify-content-center align-items-center">
              <form onSubmit={handleSubmit}>
                <div className="reg_form row mx-0 registeration_form">
                  <h2 className="form_title text-uppercase col-12 text-center">
                    Register
                  </h2>
                  <div className="form_item col-md-6 col-12">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name*"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      className={`form-control ${
                        errors.firstname && "is-invalid"
                      }`}
                    />
                  </div>
                  <div className="form_item col-md-6 col-12">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name*"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                      className={`form-control ${
                        errors.lastname && "is-invalid"
                      }`}
                    />
                  </div>
                  {/* <div className="form_item col-md-12 col-12">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username*"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className={`form-control ${
                        errors.username && "is-invalid"
                      }`}
                    />
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div> */}
                  <div className="form_item col-md-6 col-12">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email*"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`form-control ${errors.email && "is-invalid"}`}
                    />
                  </div>
                  <div className="form_item col-md-6 col-12">
                    <input
                      type="tel"
                      name="mobileno"
                      placeholder="Mobile Number*"
                      value={formData.mobileno}
                      onChange={handleChange}
                      required
                      className={`form-control ${
                        errors.mobileno && "is-invalid"
                      }`}
                    />
                  </div>
                  <div className="form_item col-md-6 col-12">
                    <div className="input-group password_input_grp mb-3">
                      <input
                        type={`${showpass ? "text" : "password"}`}
                        name="password"
                        className={`form-control border-right-0 ${
                          formData.password &&
                          formData.password === formData.confirmPassword &&
                          formData.confirmPassword
                            ? "is-valid"
                            : formData.password &&
                              formData.password !== formData.confirmPassword &&
                              formData.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
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
                    {/* <input
                      type="password"
                      name="password"
                      placeholder="Password*"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`form-control ${
                        formData.password &&
                        formData.password === formData.confirmPassword &&
                        formData.confirmPassword
                          ? "is-valid"
                          : formData.password &&
                            formData.password !== formData.confirmPassword &&
                            formData.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                    /> */}
                  </div>
                  <div className="form_item col-md-6 col-12">
                    <div className="input-group password_input_grp mb-3">
                      <input
                        type={`${showpass ? "text" : "password"}`}
                        name="confirmPassword"
                        className={`form-control border-right-0 ${
                          formData.password &&
                          formData.password === formData.confirmPassword &&
                          formData.confirmPassword
                            ? "is-valid"
                            : formData.password &&
                              formData.password !== formData.confirmPassword &&
                              formData.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Confirm Password*"
                        aria-label="Password"
                        aria-describedby="basic-addon2"
                        value={formData.confirmPassword}
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
                    {/* <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password*"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`form-control ${
                        formData.password &&
                        formData.password === formData.confirmPassword &&
                        formData.confirmPassword
                          ? "is-valid"
                          : formData.password &&
                            formData.password !== formData.confirmPassword &&
                            formData.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                    /> */}
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  <div className="checkbox_item mb_30 col-12">
                    <label htmlFor="agree_checkbox">
                      <input
                        id="agree_checkbox"
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                        required
                      />{" "}
                      I agree to the Terms of User
                    </label>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="custom_btn bg_default_red text-uppercase mb_50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Create Account"}
                    </button>
                  </div>
                  <div className="create_account text-center col-12">
                    <h4 className="small_title_text text-center text-uppercase">
                      Have not account yet?
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

export default Register;
