// src/hooks/useScrollTo.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollTo = (selector) => {
  const location = useLocation();

  useEffect(() => {
    if (selector) {
      const element = document.getElementById(selector);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, selector]);
};

export default useScrollTo;
