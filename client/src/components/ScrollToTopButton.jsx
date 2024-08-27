import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {" "}
      {isVisible && (
        // <div className="scrolltotopbtndiv" style={{ cursor: "pointer" }}>
        <button
          onClick={scrollToTop}
          className="scrolltotopbtndiv"
          style={{ border: "none", cursor: "pointer" }}
        >
          <i className="far fa-arrow-up" />
        </button>
        // </div>
      )}
    </>
  );
};

export default ScrollToTopButton;
