import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import useScrollTo from "../components/useScrollTo";
import { axiosInstance } from "../config";

const ContactUs = () => {
  const selector = "contactus_ref";
  useScrollTo(selector);

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileno: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    if (
      formData.name !== "" ||
      formData.email !== "" ||
      formData.mobileno !== "" ||
      formData.message !== ""
    ) {
      validateForm();
    }
    if (
      formData.name === "" &&
      formData.email === "" &&
      formData.mobileno === "" &&
      formData.message === ""
    ) {
      setErrors({});
    }
  }, [formData]);

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.mobileno) formErrors.mobileno = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobileno))
      formErrors.mobileno = "Mobile number must be exactly 10 digits";
    if (!formData.message) formErrors.message = "Message is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axiosInstance.post(
        "client/query/add/contact-us",
        formData
      );
      if (response.data.status) {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setFormData({
          name: "",
          email: "",
          mobileno: "",
          message: "",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to submit contact form. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <Header />
      <main>
        <Breadcrumb
          pagename={"Contact Us"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        <section
          id="contactus_ref"
          className="main_contact_section sec_ptb_100 clearfix"
        >
          <div className="container">
            <div className="row justify-content-lg-between">
              <div className="col-lg-5">
                <div className="main_contact_content">
                  <h3 className="title_text mb_15">Get In Touch</h3>
                  <p className="mb_50">
                    If you are interested in working with us, please get in
                    touch.
                  </p>
                  <ul className="main_contact_info ul_li_block clearfix">
                    <li>
                      <span className="icon">
                        <i className="fal fa-map-marked-alt" />
                      </span>
                      <p className="mb-0">
                        75 South Park Avenue, Melbourne, Australia
                      </p>
                    </li>
                    <li>
                      <span className="icon">
                        <i className="fal fa-phone-volume" />
                      </span>
                      <p className="mb-0">8 800 567.890.11 - Central Office</p>
                    </li>
                    <li>
                      <span className="icon">
                        <i className="fal fa-paper-plane" />
                      </span>
                      <p className="mb-0">Jthemes@gmail.com</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="main_contact_form">
                  <h3 className="title_text mb_30">Contact Us</h3>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                        <div className="form_item">
                          <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`form-control shadow-none ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            required
                          />
                          {errors.name && (
                            <div className="invalid-feedback">
                              {errors.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                        <div className="form_item">
                          <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-control shadow-none ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            required
                          />
                          {errors.email && (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                        <div className="form_item">
                          <input
                            type="tel"
                            name="mobileno"
                            placeholder="Your Mobile No."
                            value={formData.mobileno}
                            onChange={handleInputChange}
                            pattern="\d{10}"
                            className={`form-control shadow-none ${
                              errors.mobileno ? "is-invalid" : ""
                            }`}
                            required
                          />
                          {errors.mobileno && (
                            <div className="invalid-feedback">
                              {errors.mobileno}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form_item">
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`form-control shadow-none ${
                          errors.message ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.message && (
                        <div className="invalid-feedback">{errors.message}</div>
                      )}
                    </div>
                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="custom_btn bg_default_red text-uppercase"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
