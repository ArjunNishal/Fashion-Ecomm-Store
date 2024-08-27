import React, { useState } from "react";
import { axiosInstance } from "../config";
import Swal from "sweetalert2";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("client/newsletter/subscribe", {
        email,
      });
      setMessage(response.data.message);
      setError("");
      setEmail("");
      Swal.fire("Success", "Subscribed Successfully", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      Swal.fire("Error", err.response.data.message, "error");
      setMessage("");
      setEmail("");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row no-gutters">
        <div className="col-lg-8">
          <div
            className="sports_newsletter d-flex align-items-center"
            // data-background="assets/images/backgrounds/bg_33.jpg"
          >
            <div className="content_wrap text-center text-white">
              <span
                className="sub_title text-uppercase"
                data-text-color="#ff3f3f"
              >
                Join Our
              </span>
              <h2 className="title_text text-uppercase text-white mb_15">
                Newsletters Now!
              </h2>
              <p className="mb_30">
                Hugo &amp; Marie is an independent artist management firm and
                Creative agency based in New York City. Founded in 2008
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form_item mb-0">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="submit_btn bg_sports_red text-uppercase"
                  >
                    SUBSCRIBE
                  </button>
                </div>
              </form>
              {/* {message && <p className="text-success mt-3">{message}</p>} */}
              {/* {error && <p className="text-danger mt-3">{error}</p>} */}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div
            className="sports_feature_video"
            data-background="assets/images/backgrounds/bg_34.jpg"
          >
            <a
              className="play_btn_1"
              href="http://www.youtube.com/watch?v=0O2aH4XLbto"
            >
              <span>
                <i className="fas fa-play" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
