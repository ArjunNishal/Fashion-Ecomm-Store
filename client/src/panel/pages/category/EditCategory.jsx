import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { closeeditCategorymodal } from "../../components/dashboardconfig";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, renderUrl } from "../../../config";

const EditCategory = ({
  getcategories,
  selectedCategory,
  editCatFormData,
  seteditCatFormData,
}) => {
  const fileInputRef = React.useRef(null);
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [image, setimage] = useState(null);

  const handleChange = (e) => {
    const { value, name, type } = e.target;
    console.log(e.target, name, type, editCatFormData);

    if (name === "image") {
      const file = e.target.files[0]; // Get the first file from the FileList
      if (file) {
        setimage(file); // Update state with the selected file
      }
    } else if (name === "username") {
      const newValue = value.replace(/\s+/g, "");
      seteditCatFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    } else if (type === "checkbox") {
      seteditCatFormData((prevFormData) => ({
        ...prevFormData,
        featureCategory: e.target.checked === true ? 1 : 0,
      }));
    } else {
      seteditCatFormData({
        ...editCatFormData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const editcatformdata = new FormData();

      editcatformdata.append("name", editCatFormData.name);
      editcatformdata.append(
        "featureCategory",
        editCatFormData.featureCategory
      );
      editcatformdata.append("offer", editCatFormData.offer);

      if (image) {
        editcatformdata.append("image", image);
      }

      const response = await axiosInstance.put(
        `panel/cat/edit/category/${selectedCategory?._id}`,
        editcatformdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Category Edited",
          text: "The Category has been edited successfully!",
        });
        // Clear form
        seteditCatFormData({
          username: "",
          previousimage: "",
          featureCategory: 0,
          offer: "",
        });
        closeeditCategorymodal();
        getcategories();
      }
    } catch (error) {
      console.error(error);
      closeeditCategorymodal();
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

        {/* Modal */}
        <div
          className="modal fade"
          id={`editmodalCategory`}
          tabIndex={-1}
          aria-labelledby="editmodalCategoryLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editmodalCategoryLabel">
                  Edit Category
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="EditCategoryModalClosebtn"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="edit_admin_form">
                  <form onSubmit={handleSubmit}>
                    <div className="row mx-0">
                      <div className=" col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Category Name<span className="text-danger">*</span>
                          </label>
                          <input
                            name="name"
                            value={editCatFormData.name}
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
                            value={editCatFormData.offer}
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
                              checked={editCatFormData.featureCategory === 1}
                              className="custom-control-input"
                              id="customSwitch1edit"
                              onChange={(e) => {
                                handleChange(e);
                                // seteditCatFormData({
                                //   ...editCatFormData,
                                //   featureCategory:
                                //     e.target.checked === true ? 1 : 0,
                                // });
                              }}
                            />
                            <label
                              className="custom-control-label check_label"
                              htmlFor="customSwitch1edit"
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
                              required={
                                editCatFormData.previousimage ? false : true
                              }
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              {image ? image.name : "Choose New Image"}
                            </label>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="col-6">
                        <div className="selected_image border p-1 my-1">
                          <p className="text-center">
                            <small>Current Image</small>
                          </p>
                          <img
                            src={`${renderUrl}uploads/category/${editCatFormData.previousimage}`}
                            alt=""
                          />
                        </div>
                      </div>
                      {image && (
                        <div className=" col-6 mb-2">
                          <div className="selected_image text-center  border rounded p-2 my-2">
                            <p className="text-center">
                              <small>
                                <b>New File selected</b>
                              </small>{" "}
                              <br />
                              <small>{image.name}</small>
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
                          Save
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

export default EditCategory;
