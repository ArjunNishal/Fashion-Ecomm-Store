import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";
import useScrollTo from "../../components/useScrollTo";
import Swal from "sweetalert2";

const LoginAdmin = () => {
  // const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  useScrollTo();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // useEffect(() => {
  //   if (localStorage.getItem("admin") !== (null || undefined || "")) {
  //     navigate("/panel_dashboard");
  //   }
  // }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("panel/auth/login", {
        email,
        password,
      });

      if (response.data.status) {
        console.log(response.data.data);
        localStorage.setItem("admin", response.data.data.token);
        navigate("/panel_dashboard");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire(
        "Error",
        error.response ? error.response.data.message : "Login failed",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleLogin = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const response = await axiosInstance.post("admin/admin-login", {
  //       mobileno: mobile,
  //       password: password,
  //     });

  //     // Assuming the response contains the token and admin data
  //     const { token, data } = response.data;

  //     // Store the token in localStorage or session for authentication
  //     localStorage.setItem("admin", token);

  //     // Redirect to the desired page after successful login
  //     navigate("/admin");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     // Handle login error, e.g., show an error message to the user
  //   }
  // };
  const [showpass, setshowpass] = useState(false);
  return (
    // <div>
    //   <div className="login-container d-flex align-items-center justify-content-center container">
    //     <div className="login-main d-flex justify-content-center">
    //       <div className="border rounded bg-white p-3">
    //         <h3 className="py-2 text-center">Login</h3>
    //         <form
    //           // onSubmit={handleLogin}
    //           className="p-2 login-form d-flex flex-column"
    //         >
    //           <label className="form-label" htmlFor="mobile">
    //             Mobile
    //           </label>
    //           <input
    //             type="number"
    //             className="form-control"
    //             value={mobile}
    //             onChange={(e) => setMobile(e.target.value)}
    //             required
    //           />

    //           <label className="form-label" htmlFor="password">
    //             Password
    //           </label>
    //           <input
    //             type="password"
    //             className="form-control"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             required
    //           />
    //           <Link to="/admin" type="submit" className="btn btn-success m-2">
    //             Login
    //           </Link>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <main className="login-main">
      <section
        className="register_section admin_login sec_ptb_140 has_overlay parallaxie clearfix"
        data-background="assets/images/backgrounds/bg_22.jpg"
      >
        <div className="overlay" data-bg-color="rgba(55, 55, 55, 0.75)" />
        <div className="container">
          <div className="reg_form_wrap login_form d-flex justify-content-center align-items-center">
            <form onSubmit={handleSubmit}>
              <div className="reg_form registeration_form">
                <h2 className="form_title text-uppercase text-center">
                  Admin Login{" "}
                </h2>
                <div className="form_item">
                  <input
                    id="email_input"
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  <label htmlFor="email_input">
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
                <Link
                  className="forget_pass text-uppercase mb_30"
                  to="/forgotpassword_panel"
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
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginAdmin;
