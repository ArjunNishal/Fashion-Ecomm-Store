import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { sidebarlinks } from "./dashboardconfig";
import { jwtDecode } from "jwt-decode";
import { renderUrl } from "../../config";

const Topbar = () => {
  const token = localStorage.getItem("admin");
  const decoded = token ? jwtDecode(token) : null;
  const navigate = useNavigate();
  const back = () => {
    navigate(-1);
  };

  const location = useLocation();

  const [MSBOpen, setMSBOpen] = useState(false);

  const togglemobileSidebar = () => {
    setMSBOpen(!MSBOpen);
  };
  const logout = () => {
    try {
      localStorage.removeItem("admin");
      console.log("logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="topbar_main_div">
      <div className="topbar shadow-sm d-md-flex d-none">
        {/* <h1>Welcome {isadmin ? "Admin" : "Sub Admin"}</h1> */}
        <h1>Welcome Admin</h1>
        {/* <NavLink className="panelbtns btn" onClick={back}>
          <i className="fas fa-chevron-left"></i>&nbsp;back
        </NavLink> */}
        {/* <i className="fas fa-chevron-left"></i> */}

        <div className="dropdown">
          <button
            className="btn p-0 profile_btn_panel border-0 shadow-none"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              src={`${
                decoded?.image
                  ? `${renderUrl}uploads/profile/${decoded?.image}`
                  : "assets/images/profile.png"
              }`}
              alt="img"
            />
          </button>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="dropdownMenuButton"
          >
            <Link className="dropdown-item" to="/panel_profile">
              <i className="fas fa-user"></i> Profile
            </Link>
            <button onClick={logout} className="dropdown-item">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
      <div className={`mobile-topbar  topbar d-md-none d-flex `}>
        <button
          className="btn mobile-menu-btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobile-sidebar"
          aria-controls="mobile-sidebar"
          onClick={togglemobileSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="dropdown">
          <button
            className="btn p-0 profile_btn_panel border-0 shadow-none"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              src={`${
                decoded?.image
                  ? `${renderUrl}uploads/profile/${decoded?.image}`
                  : "assets/images/profile.png"
              }`}
              alt="img"
            />
          </button>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="dropdownMenuButton"
          >
            <Link className="dropdown-item" to="/panel_profile">
              <i className="fas fa-user"></i> Profile
            </Link>
            <button onClick={logout} className="dropdown-item">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`offcanvas mobile-sidebar offcanvas-start ${
            MSBOpen ? "show" : ""
          }`}
          tabIndex={-1}
          id="mobile-sidebar"
          aria-labelledby="mobile-sidebarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="mobile-sidebarLabel">
              
            </h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={togglemobileSidebar}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="mobile-sidebar-links">
              <div className="row mx-0">
                {sidebarlinks.map((el, index) => {
                  return (
                    <div key={index} className="col-12">
                      <Link
                        to={`${el.url}`}
                        className={`sidebar-m-link ${
                          location.pathname.includes(el.url) ? "active" : ""
                        }`}
                      >
                        <i className={`${el.icon}`}></i>&nbsp;
                        {el.name}
                      </Link>
                    </div>
                  );
                })}
                <div className="col-12">
                  <button onClick={logout} className="text-left sidebar-m-link">
                    {" "}
                    <i className="fas fa-sign-out-alt"></i>&nbsp;Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={togglemobileSidebar}
          class={`offcanvas-backdrop fade ${
            MSBOpen ? "show d-block" : "d-none"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Topbar;
