import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { closecreateCategorymodal } from "../../components/dashboardconfig";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../../config";

const CreateCategory = ({ getcategories }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);

  const fileInputRef = React.useRef(null);

  const [image, setimage] = useState(null);
  const [CreateCatFormData, setCreateCatFormData] = useState({
    name: "",
    featureCategory: 0,
    offer: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "image") {
      const file = e.target.files[0]; // Get the first file from the FileList
      if (file) {
        setimage(file); // Update state with the selected file
      }
    } else if (name === "username") {
      const newValue = value.replace(/\s+/g, "");
      setCreateCatFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    } else {
      setCreateCatFormData({
        ...CreateCatFormData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const catformdata = new FormData();

      catformdata.append("name", CreateCatFormData.name);
      catformdata.append("image", image);
      catformdata.append("featureCategory", CreateCatFormData.featureCategory);
      catformdata.append("offer", CreateCatFormData.offer);

      const response = await axiosInstance.post(
        "panel/cat/create/category",
        catformdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Category Created",
          text: "The category has been created successfully!",
        });
        // Clear form
        setCreateCatFormData({
          name: "",
          featureCategory: 0,
          offer: "",
        });
        fileInputRef.current.value = "";
        setimage(null);
        closecreateCategorymodal();
        getcategories();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message,
      });
    }
  };

  return (
    <div>
      <div>
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => {
            setimage(null);
            fileInputRef.current.value = "";
            setCreateCatFormData({
              name: "",
            });
          }}
        >
          Add Category
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create New Category
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="CreateCategoryModalClosebtn"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="create_admin_form">
                  <form onSubmit={handleSubmit}>
                    <div className="row mx-0">
                      <div className=" col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Category Name<span className="text-danger">*</span>
                          </label>
                          <input
                            name="name"
                            value={CreateCatFormData.name}
                            onChange={handleChange}
                            required
                            placeholder="Category Name"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className=" col-12">
                        <div className="mb-3">
                          <label className="form-label">Category Offer</label>
                          <input
                            name="offer"
                            value={CreateCatFormData.offer}
                            onChange={handleChange}
                            placeholder="Category offer"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              checked={CreateCatFormData.featureCategory === 1}
                              className="custom-control-input"
                              id="customSwitch1"
                              onChange={(e) => {
                                console.log(e.target.checked);
                                setCreateCatFormData({
                                  ...CreateCatFormData,
                                  featureCategory:
                                    e.target.checked === true ? 1 : 0,
                                });
                              }}
                            />
                            <label
                              className="custom-control-label check_label"
                              htmlFor="customSwitch1"
                            >
                              <b> Add to Feature Categories</b>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className=" col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Category Image<span className="text-danger">*</span>
                          </label>
                          <div className="custom-file">
                            <input
                              type="file"
                              ref={fileInputRef}
                              name="image"
                              onChange={handleChange}
                              accept="image/*"
                              className="custom-file-input"
                              id="customFile"
                              required
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              {image ? image.name : "Choose file"}
                            </label>
                          </div>
                        </div>
                      </div>
                      {image && (
                        <div className=" col-12 mb-2">
                          <div className="selected_image text-center  border rounded p-1 my-1">
                            <p className="text-center">
                              <b>Selected file:</b> {image.name}
                            </p>
                            <img
                              className=""
                              src={URL.createObjectURL(image)}
                              alt="Selected"
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-12 text-center">
                        <button className="btn btn-primary" type="submit">
                          Create
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
  );
};

export default CreateCategory;
