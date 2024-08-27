import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import Swal from "sweetalert2";
import { closecouponmodal } from "../../components/dashboardconfig";

const Coupons = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [coupons, setcoupons] = useState([]);

  const [couponForm, setcouponForm] = useState({
    name: "",
    discount: "",
    code: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount") {
      // let inputMobileNo = e.target.value;
      let inputMobileNo = e.target.value.replace(/\D/g, "");
      setcouponForm({
        ...couponForm,
        [e.target.name]: inputMobileNo,
      });
    } else {
      setcouponForm((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setloading(true);
      const res = await axiosInstance.post(
        "panel/offer/add/coupon",
        couponForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setloading(false);
      fetchCoupons();
      setcouponForm({
        name: "",
        discount: "",
        code: "",
      });
      Swal.fire("Success", res.data.message, "success");
      closecouponmodal();
    } catch (error) {
      setloading(false);
      console.log(error);
      Swal.fire("Error", error.response.data.message, "error");
    }
  };

  const fetchCoupons = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(`panel/offer/get/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setcoupons(response.data.data);
      setloading(false);
    } catch (error) {
      console.error("Error fetching Coupons:", error);
      setloading(false);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this coupon?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setloading(true);

        const response = await axiosInstance.delete(
          `panel/offer/delete/coupon/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        setcoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon._id !== id)
        );
        setloading(false);

        Swal.fire("Deleted!", "The coupon has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      setloading(false);
      Swal.fire("Error!", "There was an error deleting the coupon.", "error");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="card border-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title m-0">Coupons</h4>
        {(decoded.permissions.includes("Add Coupon") ||
          decoded.role === "superadmin") && (
          <div>
            {/* Button trigger modal */}
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addcouponmodal"
            >
              Add Coupon
            </button>
            {/* Modal */}
            <div
              className="modal fade"
              id="addcouponmodal"
              tabIndex={-1}
              aria-labelledby="addcouponmodalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addcouponmodalLabel">
                      Add Coupon
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      id="closecouponmodalbtn"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit} className="add_coupon_form">
                      <div className="row mx-0">
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={couponForm.name}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Discount
                            </label>
                            <input
                              type="text"
                              name="discount"
                              placeholder="Discount"
                              value={couponForm.discount}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Code
                            </label>
                            <input
                              type="text"
                              name="code"
                              placeholder="Code"
                              value={couponForm.code}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                              Create
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="coupon_list_wrapper">
          {coupons?.map((cp, index) => (
            <div key={index} className="coupon_card card mb-2  shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <span>{index + 1}. </span>

                    <div>
                      {cp.name}
                      <br />
                      <b>Code :</b> {cp.code}
                      <br />
                      Created by : {cp.createdby.username} (
                      {cp.createdby.role === "superadmin"
                        ? "Super admin"
                        : "Admin"}
                      )
                      <br />
                    </div>
                  </div>
                  {(decoded.permissions.includes("Edit Coupon") ||
                    decoded.role === "superadmin") && (
                    <button
                      onClick={() => {
                        deleteCoupon(cp._id);
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex justify-content-center py-3">
              <div className="spinner-border text-panel" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;
