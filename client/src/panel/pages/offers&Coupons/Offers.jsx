import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import Swal from "sweetalert2";
import { closeoffermodal } from "../../components/dashboardconfig";

const Offers = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const [offers, setoffers] = useState([]);

  const [offerForm, setofferForm] = useState({
    name: "",
    description: "",
    number: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "number") {
      // let inputMobileNo = e.target.value;
      let inputMobileNo = e.target.value.replace(/\D/g, "");
      setofferForm({
        ...offerForm,
        [e.target.name]: inputMobileNo,
      });
    } else {
      setofferForm((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setloading(true);
      const res = await axiosInstance.post(
        "panel/offer/add/offers",
        offerForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setloading(false);
      fetchOffers();
      setofferForm({
        name: "",
        description: "",
        number: "",
      });
      //   navigate("/panel_newsletter");
      Swal.fire("Success", res.data.message, "success");
      closeoffermodal();
    } catch (error) {
      setloading(false);
      console.log(error);
      // alert("Error creating product");
      Swal.fire("Error", error.response.data.message, "error");
    }
  };

  const fetchOffers = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(`panel/offer/get/offers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setoffers(response.data.data);
      setloading(false);
    } catch (error) {
      console.error("Error fetching Orders:", error);
      setloading(false);
    }
  };

  const deleteOffer = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this offer?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setloading(true);

        const response = await axiosInstance.delete(
          `panel/offer/delete/offer/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        setoffers((prevOffers) =>
          prevOffers.filter((offer) => offer._id !== id)
        );
        setloading(false);

        Swal.fire("Deleted!", "The offer has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      setloading(false);
      Swal.fire("Error!", "There was an error deleting the offer.", "error");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="card border-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title m-0">Offers</h4>
        {(decoded?.permissions?.includes("Add Offer") ||
          decoded.role === "superadmin") && (
          <div>
            {/* Button trigger modal */}
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addoffermodal"
            >
              Add Offer
            </button>
            {/* Modal */}
            <div
              className="modal fade"
              id="addoffermodal"
              tabIndex={-1}
              aria-labelledby="addoffermodalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addoffermodalLabel">
                      Add Offer
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      id="closeoffermodalbtn"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit} className="add_offer_form">
                      <div className="row mx-0">
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              S. No.
                            </label>
                            <input
                              type="text"
                              name="number"
                              placeholder="S. No."
                              value={offerForm.number}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={offerForm.name}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Description
                            </label>
                            <input
                              type="text"
                              name="description"
                              placeholder="Description"
                              value={offerForm.description}
                              onChange={handleInputChange}
                              className="form-control"
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
        <div className="offer_list_wrapper">
          {offers?.map((of, index) => (
            <div key={index} className="offer_card card mb-2  shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span>
                      <b>{of.number}.</b>{" "}
                    </span>
                    <span>
                      <b>{of.name}</b>
                    </span>
                    <br />
                    <span>{of.description}</span>
                  </div>
                  {(decoded.permissions.includes("Edit Offer") ||
                    decoded.role === "superadmin") && (
                    <button
                      onClick={() => {
                        deleteOffer(of._id);
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

export default Offers;
