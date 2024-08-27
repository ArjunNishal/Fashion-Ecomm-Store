import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Adminpage from "./Adminpage";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const Admin = () => {
  // const token = localStorage.getItem("admin");
  // const decoded = jwtDecode(token);
  // const isadmin = decoded.isAdmin;
  // const isSubAdmin = decoded.isSubAdmin;
  // const id = decoded.id;
  // console.log(isadmin, isSubAdmin, id);

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

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
        {/*========== only admin =========== */}
        <div className="middle mt-md-5  mt-0">
          <Adminpage />
        </div>
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default Admin;
