import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import BreadcrumbPanel from "../../components/BreadcrumbPanel";
import Footer from "../../components/Footer";
import Offers from "./Offers";
import Coupons from "./Coupons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const OffersNdCoupons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      decoded.role !== "superadmin" &&
      !decoded.permissions.includes("Manage Offers and Coupons")
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

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
        <div className=" mt-md-2  mt-0">
          <BreadcrumbPanel
            breadlinks={[
              {
                url: "/panel_dashboard",
                text: "Home",
              },
              {
                url: "/panel_offersandcoupons",
                text: "Offers and Coupons",
              },
            ]}
          />
          <div className="offers_and_coupons_main">
            <div className="row mx-0">
              <div className="col-md-6 col-12">
                <Offers />
              </div>
              <div className="col-md-6 col-12">
                <Coupons />
              </div>
            </div>
          </div>
        </div>
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default OffersNdCoupons;
