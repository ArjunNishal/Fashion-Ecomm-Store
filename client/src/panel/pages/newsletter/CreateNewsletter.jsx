import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import BreadcrumbPanel from "../../components/BreadcrumbPanel";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, renderUrl } from "../../../config";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sidebarlinks } from "../../components/dashboardconfig";
import Select from "react-select";
import CkeditorComponent from "../../components/CkeditorComponent";
import Swal from "sweetalert2";
import moment from "moment";
import PanelPagination from "../../components/PanelPagination";
import SelectProducts from "./SelectProducts";

const CreateNewsletter = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);

  const [productForm, setproductForm] = useState({
    heading: "",
    subheading: "",
    subject: "",
    selectedproducts: [],
    btntext: "",
    btnurl: "",
    btmheading: "",
    btmsubheading: "",
    images: [],
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (
      decoded.role !== "superadmin" &&
      !decoded.permissions.includes("Add Newsletter")
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  // add product functions============================================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setproductForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const [formchanged, setformchanged] = useState(false);

  useEffect(() => {
    if (formchanged === true) {
      validateForm();
    }
  }, [productForm]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setformchanged(true);

    setproductForm((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  const removeImage = (index) => {
    const images = [...productForm.images];
    images.splice(index, 1);
    setproductForm((prevState) => ({ ...prevState, images }));
  };

  const validateForm = () => {
    const errors = {};

    // Validate product details
    if (!productForm.subject) errors.subject = "Subject is required";

    if (productForm.btntext && !productForm.btnurl) {
      errors.btnurl = "Button Url is required";
    }
    if (!productForm.btntext && productForm.btnurl) {
      errors.btntext = "Button Text is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  console.log(errors);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();

      formData.append("heading", productForm.heading);
      formData.append("subheading", productForm.subheading);
      formData.append("subject", productForm.subject);
      formData.append("btntext", productForm.btntext);
      formData.append("btnurl", productForm.btnurl);
      formData.append("btmheading", productForm.btmheading);
      formData.append("btmsubheading", productForm.btmsubheading);
      formData.append(
        "selectedproducts",
        JSON.stringify(productForm.selectedproducts.map((c) => c))
      );
      productForm.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      try {
        setloading(true);
        const res = await axiosInstance.post(
          "panel/query/send/newsletter",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setloading(false);
        navigate("/panel_newsletter")
        Swal.fire("Success", res.data.message, "success");
      } catch (error) {
        setloading(false);
        console.log(error);
        // alert("Error creating product");
        Swal.fire("Error", error.response.data.message, "error");
      }
    }
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
                url: "/panel_newsletter",
                text: "Newsletters",
              },
              {
                url: "/panel_createnewsletter",
                text: "Send Newsletter",
              },
            ]}
          />
          <div className="admin_main container-fluid">
            <div className="create_product_form_main">
              <div className="card border-0 shadow">
                <div className="card-header">
                  <h6 className="m-0">Send Newsletter</h6>
                </div>
                <div className="card-body">
                  <div className="create_product_form">
                    <form onSubmit={handleSubmit}>
                      <div className="row mx-0">
                        <div className=" col-12 ">
                          <div className="mb-3">
                            <label className="form-label">Subject</label>
                            {/* <Select
                              isMulti
                              name="categories"
                              options={CategoriesOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              value={productForm.categories}
                              onChange={handleSelectChange}
                            /> */}
                            <input
                              type="text"
                              name="subject"
                              placeholder="Subject"
                              className="form-control"
                              value={productForm.subject}
                              onChange={handleInputChange}
                              required
                            />
                            {errors.subject && (
                              <div className="text-danger invalid-font">
                                {errors.subject}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className=" col-12 ">
                          <div className="mb-3">
                            <label className="form-label">Heading Text</label>
                            <input
                              placeholder="Heading Text"
                              type="text"
                              name="heading"
                              value={productForm.heading}
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.productName ? "is-invalid" : ""
                              }`}
                            />{" "}
                            {errors.heading && (
                              <div className="invalid-feedback">
                                {errors.heading}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className=" col-12 ">
                          <div className="mb-3">
                            <label className="form-label">
                              Sub Heading Text
                            </label>
                            <input
                              placeholder="Sub  Heading Text"
                              type="text"
                              name="subheading"
                              value={productForm.subheading}
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.subheading ? "is-invalid" : ""
                              }`}
                            />{" "}
                            {errors.subheading && (
                              <div className="invalid-feedback">
                                {errors.subheading}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* images */}
                        <div className="col-12">
                          <hr />
                          <p>
                            <b>Product Images</b>
                          </p>
                        </div>
                        <div className="col-12">
                          <div className="product_images_main_box">
                            <div className="row mx-0">
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="form-label">Images</label>
                                  <div className="custom-file">
                                    <input
                                      type="file"
                                      // ref={fileInputRef}
                                      name="images"
                                      multiple
                                      onChange={handleFileChange}
                                      accept="image/*"
                                      className="custom-file-input"
                                      id="customFile"
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="customFile"
                                    >
                                      {/* choose file */}
                                      {productForm?.images &&
                                      productForm?.images?.length > 0
                                        ? `${productForm?.images?.length} files selected`
                                        : "Choose file"}
                                    </label>
                                  </div>
                                  {errors.images && (
                                    <div className="text-danger invalid-font">
                                      {errors.images}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="product_images_row">
                                  <div className="d-flex flex-wrap">
                                    {productForm?.images?.map(
                                      (image, index) => (
                                        <div
                                          key={index}
                                          className="product_image_panel"
                                        >
                                          <img
                                            src={URL.createObjectURL(image)}
                                            alt="img"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="btn remove_img_btn p-0 border-0 shadow-0"
                                          >
                                            <i className="fas fa-times"></i>
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* products */}
                        <SelectProducts
                          productForm={productForm}
                          setproductForm={setproductForm}
                        />

                        {/* button */}
                        <div className="col-12">
                          <hr />
                          <div className="mb-3">
                            <label className="form-label" htmlFor="note">
                              Button Text
                            </label>
                            <input
                              className={`form-control ${
                                errors.btntext ? "is-invalid" : ""
                              }`}
                              id="buttontext"
                              type="text"
                              name="btntext"
                              placeholder="Button Text"
                              value={productForm.btntext}
                              onChange={handleInputChange}
                              required={productForm.btnurl ? true : false}
                            ></input>
                            {errors.btntext && (
                              <div className="invalid-feedback">
                                {errors.btntext}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="note">
                              Button Url
                            </label>
                            <input
                              className={`form-control ${
                                errors.btnurl ? "is-invalid" : ""
                              }`}
                              id="buttontext"
                              type="url"
                              name="btnurl"
                              placeholder="Button Url"
                              value={productForm.btnurl}
                              onChange={handleInputChange}
                              required={productForm.btntext ? true : false}
                            ></input>
                            {errors.btnurl && (
                              <div className="invalid-feedback">
                                {errors.btnurl}
                              </div>
                            )}
                          </div>
                          <hr />
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="note">
                              Bottom Line Heading
                            </label>
                            <input
                              className={`form-control ${
                                errors.btmheading ? "is-invalid" : ""
                              }`}
                              id="buttontext"
                              type="text"
                              name="btmheading"
                              placeholder=" Bottom Line Heading"
                              value={productForm.btmheading}
                              onChange={handleInputChange}
                              
                            ></input>
                            {errors.btmheading && (
                              <div className="invalid-feedback">
                                {errors.btmheading}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="note">
                              Bottom Line Small Text
                            </label>
                            <input
                              className={`form-control ${
                                errors.btmsubheading ? "is-invalid" : ""
                              }`}
                              id="buttontext"
                              type="text"
                              name="btmsubheading"
                              placeholder="Bottom Line Small Text"
                              value={productForm.btmsubheading}
                              onChange={handleInputChange}
                              
                            ></input>
                            {errors.btmsubheading && (
                              <div className="invalid-feedback">
                                {errors.btmsubheading}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="text-center">
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg"
                            >
                              {!loading ? "Send" : "Sending..."}
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
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default CreateNewsletter;
