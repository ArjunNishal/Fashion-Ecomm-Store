import React from "react";
import { useLocation } from "react-router-dom";
import { sidebarlinks } from "./dashboardconfig";

const PageHeading = () => {
  const location = useLocation();
  return (
    <h1 className="user-h1">
      <i
        className={`${
          sidebarlinks.find((el) => el.url === location.pathname).icon
        }`}
      ></i>{" "}
      {sidebarlinks.find((el) => el.url === location.pathname).name}
    </h1>
  );
};

export default PageHeading;
