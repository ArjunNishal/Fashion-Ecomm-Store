import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import Profile from "./Profile";
import { sidebarlinks } from "../../components/dashboardconfig";
import PageHeading from "../../components/PageHeading";
import { jwtDecode } from "jwt-decode";

const Adminpage = () => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);

  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  // const decoded = jwtDecode(token);
  // const isadmin = decoded.isAdmin;
  // const isSubAdmin = decoded.isSubAdmin;
  // const id = decoded.id;

  return (
    <>
      <div className="d-flex adminpage-head justify-content-between align-items-center">
        <PageHeading />
        {/* <button
          onClick={toggleProfile}
          className="profilepic"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          <i className="fa-solid fa-user"></i>
        </button> */}
      </div>
      <hr />

      {/* <div className="collapse" id="collapseExample">
        <div className="card card-body">
          <div className="profile-content">
            {" "}
            <Profile />
          </div>
        </div>
      </div> */}

      <div className="dashboard-page my-3">
        <div className="row justify-content-center gap-5 align-items-center">
          {sidebarlinks.map((el, index) => {
            return (
              (decoded.role === "superadmin" ||
                el.permission.some((p) => decoded.permissions.includes(p)) ||
                el.name === "Dashboard") && (
                <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                  <div
                    key={index}
                    className="w-100 border p-3 rounded text-center mb-2 d-flex flex-column"
                  >
                    <i className={`${el.icon} m-3`}></i>
                    <div>
                      <Link className="w-100" to={`${el.url}`}>
                        <button className="btn btn-red">{el.name}</button>{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Adminpage;
