import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { sidebarlinks } from "./dashboardconfig";
import { renderUrl } from "../../config";

const Navigation = () => {
  // decode the token =========================
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  // const isadmin = decoded.isAdmin;
  // const isSubAdmin = decoded.isSubAdmin;
  // const id = decoded.id;
  // console.log(decoded)
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    try {
      localStorage.removeItem("admin");
      console.log("logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="navigation">
      <ul className="nav flex-column flex-nowrap">
        {sidebarlinks.map(
          (el) =>
            (decoded.role === "superadmin" ||
              el.permission.some((p) => decoded.permissions.includes(p)) ||
              el.name === "Dashboard") && (
              <li className="nav-item" key={el.id}>
                <NavLink
                  to={el.url}
                  className={`nav-link panel_nav_links ${
                    el.activePageurls.some((url) =>
                      location.pathname.includes(url)
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <span className="icon">
                    {el.name === "Profile" ? (
                      <img
                        className="sidebar_profile_image"
                        src={
                          decoded?.image
                            ? `${renderUrl}uploads/profile/${decoded?.image}`
                            : "assets/images/profile.png"
                        }
                        alt=""
                      />
                    ) : (
                      <i className={el.icon}></i>
                    )}
                  </span>
                  <span className="title">&nbsp;{el.name}</span>
                </NavLink>
              </li>
            )
        )}
        <li className="nav-item ">
          <button
            style={{ width: "100%" }}
            className="nav-link logout"
            onClick={logout}
          >
            <span className="icon text-start">
              <i className="fas fa-sign-out-alt"></i>
            </span>
            <span className="title text-left">&nbsp;logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
