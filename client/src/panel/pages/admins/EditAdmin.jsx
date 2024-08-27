import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  adminpermissions,
  closeeditAdminmodal,
} from "../../components/dashboardconfig";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../../config";

const EditAdmin = ({
  getadmins,
  selectedAdmin,
  editadminFormdata,
  seteditadminFormdata,
}) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "mobileno") {
      let inputMobileNo = e.target.value;
      if (inputMobileNo.length > 10) {
        inputMobileNo = inputMobileNo.slice(0, 10);
      }
      seteditadminFormdata({
        ...editadminFormdata,
        [e.target.name]: inputMobileNo,
      });
    } else if (name === "username") {
      const newValue = value.replace(/\s+/g, "");
      seteditadminFormdata((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    } else {
      seteditadminFormdata({
        ...editadminFormdata,
        [name]: value,
      });
    }
  };

  //   console.log(editadminFormdata.permissions, " closeeditAdminmodal();");
  const handlePermissionChange = (permission) => {
    seteditadminFormdata((prevFormData) => {
      const { permissions } = prevFormData;
      console.log(permissions, "permissions");
      if (permissions?.includes(permission)) {
        return {
          ...prevFormData,
          permissions: permissions.filter((perm) => perm !== permission),
        };
      } else {
        return {
          ...prevFormData,
          permissions: [...permissions, permission],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `panel/user/edit/admin/${selectedAdmin?._id}`,
        editadminFormdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Admin Editd",
          text: "The admin has been edited successfully!",
        });
        // Clear form
        seteditadminFormdata({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          mobileno: "",
          password: "",
          permissions: [],
        });
        closeeditAdminmodal();
        getadmins();
      }
    } catch (error) {
      console.error(error);
      closeeditAdminmodal();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message,
      });
    }
  };

  const [showpass, setshowpass] = useState(false);

  return (
    <div>
      <div>
        {/* Button trigger modal */}

        {/* Modal */}
        <div
          className="modal fade"
          id={`editmodalAdmin`}
          tabIndex={-1}
          aria-labelledby="editmodalAdminLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editmodalAdminLabel">
                  Edit Admin
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="EditAdminModalClosebtn"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="edit_admin_form">
                  <form onSubmit={handleSubmit}>
                    <div className="row mx-0">
                      <div className="col-md-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Firstname<span className="text-danger">*</span>
                          </label>
                          <input
                            name="firstName"
                            value={editadminFormdata.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Firstname"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">Lastname</label>
                          <input
                            name="lastName"
                            value={editadminFormdata.lastName}
                            onChange={handleChange}
                            placeholder="Lastname"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Username<span className="text-danger">*</span>
                          </label>
                          <input
                            name="username"
                            value={editadminFormdata.username}
                            onChange={handleChange}
                            required
                            placeholder="Username"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Email<span className="text-danger">*</span>
                          </label>
                          <input
                            name="email"
                            value={editadminFormdata.email}
                            onChange={handleChange}
                            required
                            placeholder="Email"
                            type="email"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Mobile Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            name="mobileno"
                            placeholder="Mobile Number"
                            value={editadminFormdata.mobileno}
                            onChange={handleChange}
                            required
                            minLength={10}
                            max={10}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Password<span className="text-danger">*</span>
                          </label>
                          {/* <input
                            name="password"
                            value={editadminFormdata.password}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            type="password"
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
                              value={editadminFormdata.password}
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
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Permissions</label>
                        <div className="row mx-0">
                          {adminpermissions?.map((permission, index) => (
                            <div className="col-md-4 col-12" key={index}>
                              <div className="input-group">
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id={`permCheckedit${index}`}
                                  checked={editadminFormdata.permissions?.includes(
                                    permission
                                  )}
                                  onChange={() =>
                                    handlePermissionChange(permission)
                                  }
                                />
                                <label
                                  htmlFor={`permCheckedit${index}`}
                                  className={`btn w-100 ${
                                    editadminFormdata.permissions?.includes(
                                      permission
                                    )
                                      ? "btn-primary"
                                      : "btn-outline-primary"
                                  }`}
                                >
                                  {permission}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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

export default EditAdmin;
