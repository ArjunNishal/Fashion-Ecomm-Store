import React, { useState, useEffect } from "react";

const ViewQuery = ({ selectedAdmin }) => {
  return (
    <div>
      <div>
        {/* Button trigger modal */}

        {/* Modal */}
        <div
          className="modal fade"
          id={`editmodalAdmin`}
          tabIndex={-1}
          aria-labelledby="editmodalAdminLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editmodalAdminLabel">
                  Query Details
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="EditAdminModalClosebtn"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="query_details">
                  <div className="container-fluid">
                    <div className="query_field">
                      <div className="d-flex flex-md-nowrap flex-wrap align-items-start">
                        <div className="query_heading">
                          <p>
                            <small>
                              <b>Name - </b>
                            </small>
                          </p>
                        </div>
                        <div className="query_detail_box px-1">
                          <p>
                            <small>{selectedAdmin.name}</small>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="query_field">
                      <div className="d-flex flex-md-nowrap flex-wrap align-items-start">
                        <div className="query_heading">
                          <p>
                            <small>
                              <b>Email - </b>
                            </small>
                          </p>
                        </div>
                        <div className="query_detail_box px-1">
                          <p>
                            <small>{selectedAdmin.email}</small>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="query_field">
                      <div className="d-flex flex-md-nowrap flex-wrap align-items-start">
                        <div className="query_heading">
                          <p>
                            <small>
                              <b>Mobile - </b>
                            </small>
                          </p>
                        </div>
                        <div className="query_detail_box px-1">
                          <p>
                            <small>{selectedAdmin.mobileno}</small>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="query_field">
                      <div className="d-flex flex-md-nowrap flex-wrap align-items-start">
                        <div className="query_heading">
                          <p>
                            <small>
                              <b>Subject - </b>
                            </small>
                          </p>
                        </div>
                        <div className="query_detail_box px-1">
                          <p>
                            <small>{selectedAdmin.subject}</small>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="query_field">
                      <div className="d-flex flex-md-nowrap flex-wrap align-items-start">
                        <div className="query_heading">
                          <p>
                            <small>
                              <b>Message - </b>
                            </small>
                          </p>
                        </div>
                        <div className="query_detail_box px-1">
                          <p>
                            <small>{selectedAdmin.message}</small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuery;
