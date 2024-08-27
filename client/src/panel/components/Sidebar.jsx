import React from "react";
import Navigation from "./Navigation";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {" "}
      <div
        className={`dashboard my-custom-class d-md-block d-none ${
          isOpen ? "open" : "closed"
        } ${isOpen ? "" : "dashboard-closed"}`}
      >
        {/* ========= sidebar ============ */}
        <Navigation />
        <div className="logo2">
          <img src="/assets/images/logo.jpg" alt="logo" />
        </div>
        <div className="dashtoggle toggle-button" onClick={toggleSidebar}>
          {isOpen ? (
            <div className="row">
              <div className="logo1 col-2">
                <i id="times" className="fas fa-times"></i>
              </div>
            </div>
          ) : (
            <i id="bars" className="bars fas fa-bars col-2 p-0"></i>
            // <i className="fas fa-bars"></i>
          )}
        </div>
      </div>
     
    </>
  );
};

export default Sidebar;
