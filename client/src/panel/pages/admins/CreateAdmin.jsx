import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  adminpermissions,
  closecreateAdminmodal,
} from "../../components/dashboardconfig";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../../config";

const CreateAdmin = ({ getadmins }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [createadminFormdata, setcreateadminFormdata] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileno: "",
    password: "",
    permissions: [],
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "mobileno") {
      let inputMobileNo = e.target.value;
      if (inputMobileNo.length > 10) {
        inputMobileNo = inputMobileNo.slice(0, 10);
      }
      setcreateadminFormdata({
        ...createadminFormdata,
        [e.target.name]: inputMobileNo,
      });
    } else if (name === "username") {
      const newValue = value.replace(/\s+/g, "");
      setcreateadminFormdata((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    } else {
      setcreateadminFormdata({
        ...createadminFormdata,
        [name]: value,
      });
    }
  };

  const handlePermissionChange = (permission) => {
    setcreateadminFormdata((prevFormData) => {
      const { permissions } = prevFormData;
      if (permissions.includes(permission)) {
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
      const response = await axiosInstance.post(
        "panel/user/addAdmin",
        createadminFormdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Admin Created",
          text: "The admin has been created successfully!",
        });
        // Clear form
        setcreateadminFormdata({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          mobileno: "",
          password: "",
          permissions: [],
        });
        closecreateAdminmodal();
        getadmins();
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
  const [showpass, setshowpass] = useState(false);
  return (
    <div>
      <div>
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Add Admin
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create New Admin
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="CreateAdminModalClosebtn"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="create_admin_form">
                  <form onSubmit={handleSubmit}>
                    <div className="row mx-0">
                      <div className="col-md-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Firstname<span className="text-danger">*</span>
                          </label>
                          <input
                            name="firstName"
                            value={createadminFormdata.firstName}
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
                            value={createadminFormdata.lastName}
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
                            value={createadminFormdata.username}
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
                            value={createadminFormdata.email}
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
                            Mobile Number<span className="text-danger">*</span>
                          </label>
                          <input
                            name="mobileno"
                            placeholder="Mobile Number"
                            value={createadminFormdata.mobileno}
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

                          <div className="input-group password_input_grp mb-3">
                            <input
                              type={`${showpass ? "text" : "password"}`}
                              name="password"
                              className="form-control border-right-0"
                              placeholder="Password"
                              aria-label="Password"
                              aria-describedby="basic-addon2"
                              value={createadminFormdata.password}
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
                          {adminpermissions.map((permission, index) => (
                            <div className="col-md-4 col-12" key={index}>
                              <div className="input-group">
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id={`permCheck${index}`}
                                  checked={createadminFormdata.permissions.includes(
                                    permission
                                  )}
                                  onChange={() =>
                                    handlePermissionChange(permission)
                                  }
                                />
                                <label
                                  htmlFor={`permCheck${index}`}
                                  className={`btn w-100 ${
                                    createadminFormdata.permissions.includes(
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

export default CreateAdmin;
