import React from "react";
import { Link } from "react-router-dom";

const BreadcrumbPanel = ({ breadlinks }) => {
  return (
    <nav aria-label="breadcrumb ">
      <ol className="breadcrumb bread_panel">
        {breadlinks?.map((el, index) => (
          <li
            className={`breadcrumb-item ${
              index + 1 === breadlinks.length ? "active" : ""
            } `}
            key={index}
          >
            {index + 1 === breadlinks.length ? (
              <>{el?.text}</>
            ) : (
              <Link to={`${el?.url}`}>{el?.text}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbPanel;
