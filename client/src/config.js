import axios from "axios";
import Swal from "sweetalert2";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  // baseURL: "https://zocare.onrender.com/api/",
});

export const stateapitoken =
  "mqgZ6fXZLDGQeerUZZDQJF9QNU4pIpWS6KzB1MpXtaqtzbuYpCKKzHWPODEIsG3IZCM";

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(
      error,
      "error from interceptors //////////////////////////////////////////////"
    );
    if (error.response && error.response.status === 403) {
      if (localStorage.getItem("user")) {
        localStorage.removeItem("user");
      }
      if (localStorage.getItem("admin")) {
        localStorage.removeItem("admin");
      }

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export const renderUrl = "http://localhost:8000/";
