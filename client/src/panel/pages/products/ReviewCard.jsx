import React, { useState } from "react";
import { axiosInstance, renderUrl } from "../../../config";
import moment from "moment";
import Swal from "sweetalert2";

const ReviewCard = ({ rev, productId, stars, getproduct }) => {
  const token = localStorage.getItem("admin");
  const [editContent, seteditContent] = useState("");
  const [edit, setedit] = useState(false);
  const [loading, setloading] = useState(false);

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      setloading(true);
      const res = await axiosInstance.put(
        `panel/product/editreview/${productId}/${rev._id}`,
        { comment: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setloading(false);

      Swal.fire("Success", res.data.message, "success");
      getproduct();
    } catch (error) {
      setloading(false);
      console.log(error);
      // alert("Error creating product");
      Swal.fire("Error", error.response.data.message, "error");
    }
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
          `panel/product/delete_review/${productId}/${rev._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setloading(false);

        Swal.fire("Deleted!", res.data.message, "success");
        getproduct();
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
            <div className="review_rating ml-3">
              <div className="rating_wrap d-flex align-items-center text-uppercase">
                <ul className="rating_star ul_li mr-2 clearfix">{stars}</ul>
              </div>
            </div>
          </div>
          {!edit && <p className="review_text mb-0">{rev?.comment}</p>}
          {edit && (
            <div className="w-100 mt-2">
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
                  rev.comment === editContent
                    ? true
                    : !editContent
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
            {!edit && (
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
  );
};

export default ReviewCard;
