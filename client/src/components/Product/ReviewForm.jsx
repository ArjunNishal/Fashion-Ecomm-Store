import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../config";

const ReviewForm = ({
  product,
  setproduct,
  showreviewform,
  setshowreviewform,
  fetchproduct,
}) => {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState({});
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState(""); // State for rating validation error

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setToken(token);
      const decoded = jwtDecode(token);
      const showForm = !product?.reviews?.some(
        (el) => el.user._id === decoded.id
      );
      setDecoded(decoded);
      setshowreviewform(showForm);
    }
  }, [product, setshowreviewform]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setRatingError(""); // Clear any previous rating error on change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate rating
    if (!rating) {
      setRatingError("Please select a rating");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `auth/client/product/addreview/${product._id}`,
        {
          userId: decoded.id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        const latestReview = response.data.data.latestReview;
        setRating(0); // Reset the rating
        setComment(""); // Reset the comment

        // Fetch updated product data after adding the review
        fetchproduct();
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      Swal.fire("Error", "An error occurred while adding review", "error");
    }
  };

  return (
    <>
      {showreviewform && token !== "" && (
        <div>
          <hr />
          <h4 className="text-center">Add a Review</h4>
          <form onSubmit={handleSubmit}>
            <div className="form_item d-flex align-items-center ">
              <label className="m-0">Rating:</label>
              <div className="star-rating">
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
            </div>
            {ratingError && (
              <div className="text-danger small mb-2">{ratingError}</div>
            )}
            <div className="form_item">
              <textarea
                name="comment"
                placeholder="Your Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="custom_btn bg_default_red text-uppercase"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ReviewForm;
