import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protect = (props) => {
  const navigate = useNavigate();
  const { Component } = props;
  useEffect(() => {
    const login = localStorage.getItem("user");
    if (!login) {
      // alert("Login first");
      navigate("/login");
    }
  }, []);
  if (!localStorage.getItem("user")) {
    return null;
  }

  return (
    <div>
      <Component />
    </div>
  );
};

export default Protect;
