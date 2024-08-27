import React, { useEffect, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { axiosInstance, renderUrl } from "../../config";
import { jwtDecode } from "jwt-decode";

const ReviewCardWeb = ({
  rev,
  productId,
  getproduct,
  setshowreviewform,
  setproduct,
}) => {
  const [token, settoken] = useState("");
  const [decoded, setdecoded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) {
      return;
    } else {
      settoken(token);
      const decoded2 = jwtDecode(token);
      setdecoded(decoded2);
    }
  }, []);
  const [editContent, seteditContent] = useState("");
  const [comment, setcomment] = useState("");
  const [revRating, setrevRating] = useState("");
  const [edit, setedit] = useState(false);
  const [loading, setloading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [stars, setStars] = useState([]);

  const countrating = () => {
    const normalizedRating = Math.min(Math.max(rating, 0), 5);
    const starElements = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= normalizedRating) {
        starElements.push(
          <li key={i}>
            <i className="fas fa-star"></i>
          </li>
        );
      } else if (i - 0.5 === normalizedRating) {
        starElements.push(
          <li key={i}>
            <i className="fas fa-star-half-alt"></i>
          </li>
        );
      } else {
        starElements.push(
          <li key={i}>
            <i className="far fa-star"></i>
          </li>
        );
      }
    }

    setStars(starElements);
  };
  useEffect(() => {
    setrevRating(rev.rating);
    setRating(rev.rating);
    setcomment(rev.comment);
  }, [rev]);

  useEffect(() => {
    countrating();
  }, [rating]);

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      setloading(true);
      const res = await axiosInstance.put(
        `auth/client/product/editreview/${productId}/${rev._id}`,
        { comment: editContent, rating: rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setloading(false);

      //   Swal.fire("Success", res.data.message, "success");
      //   getproduct();
      setRating(res.data.data.reviewToUpdate.rating);
      setrevRating(res.data.data.reviewToUpdate.comment);
      setcomment(res.data.data.reviewToUpdate.comment);
      //   countrating();

      setedit(false);
    } catch (error) {
      setloading(false);
      console.log(error);
      // alert("Error creating product");
      Swal.fire("Error", error.response.data.message, "error");
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const deleteRev = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete review!",
    });

    if (result.isConfirmed) {
      try {
        setloading(true);
        const res = await axiosInstance.delete(
          `auth/client/product/delete_review/${productId}/${rev._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setloading(false);

        // Swal.fire("Deleted!", res.data.message, "success");

        // getproduct();
        setproduct(res.data.data.reviews);
        setshowreviewform(true);
      } catch (error) {
        setloading(false);
        console.log(error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Something went wrong!",
          "error"
        );
      }
    }
  };
  return (
    <div>
      <div className="review_box mb-2">
        <div className="d-flex">
          <div className="review_user_img ">
            <div className="d-flex w-100 h-100 justify-content-center text-center align-items-center">
              {rev?.user?.image ? (
                <img
                  src={`${renderUrl}uploads/profile/${rev?.user?.image}`}
                  alt="user"
                />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
          </div>
          <div className="review_user_details px-2 w-100">
            <div className="d-flex align-items-center review_user_name">
              <div className="user_nname_review_text">
                <small>
                  <b>{rev?.user?.username}</b>
                </small>
              </div>
              {!edit && (
                <div className="review_rating ml-3">
                  <div className="rating_wrap d-flex align-items-center text-uppercase">
                    <ul className="rating_star ul_li mr-2 clearfix">{stars}</ul>
                  </div>
                </div>
              )}
            </div>
            {!edit && <p className="review_text mb-0">{comment}</p>}
            {edit && decoded && (
              <div className="w-100 mt-2">
                <div className="star-rating justify-content-start mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${
                        star <= (hoverRating || rating) ? "checked" : ""
                      }`}
                      onClick={() => handleRatingChange(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    ></i>
                  ))}
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => seteditContent(e.target.value)}
                  className="form-control"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={
                    rev.comment === editContent && rating === revRating
                      ? true
                      : !editContent
                      ? true
                      : !rating
                      ? true
                      : false
                  }
                  className="btn text-success p-0 btn-sm"
                >
                  <i className="far fa-check-circle"></i>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setedit(false);
                  }}
                  className="btn text-danger p-0 btn-sm ml-2"
                >
                  <i className="far fa-times-circle"></i>
                </button>
              </div>
            )}
            <div className="action_tab_review">
              <span className="review_date">
                {moment(rev.createdAt).format("Do MMMM YYYY , hh:mm a")}
              </span>
              {!edit && decoded && decoded.id === rev.user._id && (
                <span className="review_actions ml-3">
                  <button
                    type="button"
                    onClick={() => {
                      seteditContent(rev.comment);
                      setedit(true);
                    }}
                    className="btn btn-sm p-0 mx-1"
                  >
                    <i className="far fa-edit"></i>
                  </button>
                  <button
                    onClick={() => deleteRev()}
                    className="btn btn-sm p-0 mx-1"
                  >
                    <i className="far fa-trash-alt"></i>
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardWeb;
