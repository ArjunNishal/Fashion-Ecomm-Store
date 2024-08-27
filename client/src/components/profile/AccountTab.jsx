import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AccountTab = ({ profile, fetchProfile }) => {
  const token = localStorage.getItem("user");
  const decoded = jwtDecode(token);
  const [disabled, setdisabled] = useState(true);
  const [ShowSubmitbtn, setShowSubmitbtn] = useState(false);

  const [profileForm, setprofileForm] = useState({
    firstname: "",
    lastname: "",
    mobileno: "",
    // username: "",
    email: "",
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setprofileForm({
      ...profileForm,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "mobileno") {
      let inputMobileNo = e.target.value.replace(/\D/g, "");
      // setisvalidmobile(true);
      if (inputMobileNo.length > 10) {
        inputMobileNo = inputMobileNo.slice(0, 10);
        // setisvalidmobile(false);
      }

      setprofileForm({
        ...profileForm,
        [e.target.name]: inputMobileNo,
      });
    }

    // Validate username for spaces
    // if (name === "username") {
    //   const newValue = value.replace(/\s+/g, "");
    //   setprofileForm((prevFormData) => ({
    //     ...prevFormData,
    //     [name]: newValue,
    //   }));
    //   return;
    // }
  };

  useEffect(() => {
    setprofileForm({
      firstname: profile.firstname,
      lastname: profile.lastname,
      mobileno: profile.mobileno,
      // username: profile.username,
      email: profile.email,
    });
  }, [profile]);

  useEffect(() => {
    setprofileForm({
      firstname: profile.firstname,
      lastname: profile.lastname,
      mobileno: profile.mobileno,
      // username: profile.username,
      email: profile.email,
    });
  }, [disabled === true]);

  useEffect(() => {
    if (
      (profileForm.firstname !== profile.firstname && profileForm.firstname) ||
      (profileForm.lastname !== profile.lastname && profileForm.lastname) ||
      // (profileForm.username !== profile.username && profileForm.username) ||
      (profileForm.email !== profile.email && profileForm.email) ||
      (profileForm.mobileno !== profile.mobileno && profileForm.mobileno)
    ) {
      setShowSubmitbtn(true);
    } else {
      setShowSubmitbtn(false);
    }
  }, [profileForm]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.put(
        `auth/client/user/updateprofiledetails`,
        {
          userId: decoded.id,
          firstname: profileForm.firstname,
          lastname: profileForm.lastname,
          // username: profileForm.username,
          email: profileForm.email,
          mobileno: profileForm.mobileno,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setdisabled(true);
        setShowSubmitbtn(false);
        fetchProfile();
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      Swal.fire("Error", error.response.data.message, "error");
    }
  };

  return (
    <div>
      <div className="card my_account_card border-0 shadow">
        <div className="card-body">
          <div className="card-title border-bottom border_danger">
            <div className="d-flex justify-content-between align-items-center">
              <h4>My Account</h4>
              <button
                type="button"
                onClick={() => {
                  setdisabled(!disabled);
                }}
                className="btn btn-outline-danger shadow-none btn-sm border-0"
              >
                {disabled ? (
                  <i className="fas fa-pen"></i>
                ) : (
                  <i class="fas fa-times-circle"></i>
                )}
              </button>
            </div>
          </div>
          <div className="my_account_form">
            <div className="reg_form_wrap ">
              <form className="px-0" onSubmit={handleSubmit}>
                <div className="row mx-0">
                  {/* {disabled && (
                    <div className="form_item  col-md-6 col-12">
                      <h4 className="text-capitalize">{`${profile.firstname} ${profile.lastname}`}</h4>
                    </div>
                  )} */}
                  {/* {!disabled && (
                    <> */}
                  <div className="form_item col-md-6 col-12">
                    <input
                      id="username_input"
                      type="text"
                      name="firstname"
                      title="First Name"
                      placeholder="First Name"
                      value={profileForm.firstname}
                      onChange={handleChange}
                      required
                      className=""
                      disabled={disabled}
                    />
                    <label htmlFor="username_input">
                      <i class="fas fa-file-signature"></i>
                    </label>
                  </div>
                  <div className="form_item col-md-6 col-12">
                    <input
                      id="username_input"
                      type="text"
                      name="lastname"
                      title="Last Name"
                      placeholder="Last Name"
                      value={profileForm.lastname}
                      onChange={handleChange}
                      className=""
                      disabled={disabled}
                    />
                    <label htmlFor="username_input">
                      <i class="fas fa-signature"></i>
                    </label>
                  </div>
                  {/* <div className="form_item col-md-6 col-12">
                    <input
                      id="username_input"
                      type="text"
                      name="username"
                      title="Username"
                      placeholder="Username"
                      value={profileForm.username}
                      onChange={handleChange}
                      required
                      className=""
                      disabled={disabled}
                    />
                    <label htmlFor="username_input">
                      <i className="fal fa-user" />
                    </label>
                  </div> */}
                  <div className="form_item col-md-6 col-12">
                    <input
                      id="password_input"
                      type="email"
                      name="email"
                      title="Email"
                      placeholder="Email"
                      value={profileForm.email}
                      onChange={handleChange}
                      required
                      className=""
                      disabled={disabled}
                    />
                    <label htmlFor="password_input">
                      <i class="far fa-envelope"></i>
                    </label>
                  </div>

                  <div className="form_item col-md-6 col-12">
                    <input
                      type="tel"
                      name="mobileno"
                      placeholder="Mobile No."
                      title="Mobile No."
                      value={profileForm.mobileno}
                      onChange={handleChange}
                      required
                      className="   "
                      disabled={disabled}
                    />
                    <label htmlFor="password_input">
                      <i class="fas fa-phone-alt"></i>
                    </label>
                  </div>
                  {!disabled && ShowSubmitbtn && (
                    <div className="text-center col-12">
                      <button className="custom_btn bg_sports_red btn_sm rounded">
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
