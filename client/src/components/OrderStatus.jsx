import React from "react";
import PropTypes from "prop-types";

// Adjusted order statuses
const orderStatuses = [
  "order_placed",
  "packed",
  "out_for_delivery",
  "delivered",
];

const OrderStatus = ({ currentStatus }) => {
  const getStatusClassMobile = (status) => {
    if (currentStatus === "payment_failed") {
      return status === "order_placed"
        ? "tracking-item completed"
        : "tracking-item-pending";
    }

    if (currentStatus === "confirmed") {
      return status === "packed" || status === "order_placed"
        ? "tracking-item completed"
        : "tracking-item-pending";
    }

    const statusIndex = orderStatuses.indexOf(status);
    const currentIndex = orderStatuses.indexOf(currentStatus);

    if (statusIndex < currentIndex) {
      return "tracking-item completed";
    } else if (statusIndex === currentIndex) {
      return "tracking-item current";
    } else {
      return "tracking-item-pending";
    }
  };

  const getStatusClassDesktop = (status) => {
    if (currentStatus === "payment_failed") {
      return status === "order_placed"
        ? "progtrckr-done  text-capitalize"
        : "progtrckr-todo  text-capitalize";
    }

    if (currentStatus === "confirmed") {
      return status === "packed" || status === "order_placed"
        ? " text-capitalize progtrckr-done"
        : " text-capitalize progtrckr-todo";
    }

    const statusIndex = orderStatuses.indexOf(status);
    const currentIndex = orderStatuses.indexOf(currentStatus);

    if (statusIndex < currentIndex) {
      return "progtrckr-done text-capitalize";
    } else if (statusIndex === currentIndex) {
      return "progtrckr-done text-capitalize";
    } else {
      return "progtrckr-todo text-capitalize";
    }
  };

  return (
    <div className="container py-3">
      {/* Mobile view */}
      <div className="d-md-none d-block">
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <div id="tracking-pre"></div>
            <div id="tracking">
              <div className="tracking-list">
                {orderStatuses.map((status, index) => (
                  <div key={index} className={getStatusClassMobile(status)}>
                    <div className="tracking-icon status-intransit">
                      <svg
                        className="svg-inline--fa fa-circle fa-w-16"
                        aria-hidden="true"
                        data-prefix="fas"
                        data-icon="circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
                        ></path>
                      </svg>
                    </div>
                    <div className="tracking-content">
                      {status.replace(/_/g, " ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="d-md-block d-none">
        <div>
          <ol className="progtrckr" data-progtrckr-steps={orderStatuses.length}>
            {orderStatuses.map((status, index) => (
              <li key={index} className={getStatusClassDesktop(status)}>
                {status === "order_placed"
                  ? "Order placed"
                  : status === "packed" || status === "confirmed"
                  ? "Packed"
                  : status === "out_for_delivery"
                  ? "Out For delivery"
                  : status === "delivered"
                  ? "Delivered"
                  : ""}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

OrderStatus.propTypes = {
  currentStatus: PropTypes.string.isRequired,
};

export default OrderStatus;
