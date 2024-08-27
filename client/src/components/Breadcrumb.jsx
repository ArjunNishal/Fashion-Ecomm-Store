import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ pagename, breadcrumbitems, backgroundimg }) => {
  return (
    <>
      <section
        className="breadcrumb_section sports_breadcrumb d-flex align-items-end clearfix"
        data-background={backgroundimg}
      >
        <div className="container">
          <h1
            className="sports_page_title mb-0 text-uppercase"
            data-text-color="#363636"
          >
            {pagename}
          </h1>
        </div>
      </section>
      <div className="sports_breadcrumb_nav_wrap">
        <div className="container">
          <ul className="sports_breadcrumb_nav ul_li clearfix">
            {breadcrumbitems?.map((el, index) => (
              <li key={index}>
                {index + 1 === breadcrumbitems.length ? (
                  <> {el?.text}</>
                ) : (
                  <Link to={`${el?.url}`}>
                    {el?.text === "home" || el?.text === "Home" ? (
                      <i className="fas fa-home" />
                    ) : (
                      ""
                    )}
                    {el?.text}
                  </Link>
                )}
              </li>
            ))}
            {/* <li>Shop</li>
            <li>Sports</li>
            <li>Shop Page</li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb;
