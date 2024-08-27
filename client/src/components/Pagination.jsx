import React, { useState, useEffect } from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  onPageChange,
  currentPage,
  setCurrentPage,
}) => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setitemsPerPage] = useState(10);
  // const [totalpages, settotalpages] = useState(0);

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // <Pagination
  //             totalItems={totalpages}
  //             itemsPerPage={itemsPerPage}
  //             onPageChange={handlePageChange}
  //           />

  // const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);

  // console.log(totalItems,"totalitems")

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  useEffect(() => {
    console.log(totalItems, "totalItems");
    settotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  //   const totalPages =

  const renderPageNumbers = () => {
    const pages = [];

    // When on the first 3 pages or the last 2 pages
    if (currentPage <= 3 || currentPage > totalPages - 2) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(
          <li
            key={i}
            className={`page-item int-pg-item ${
              currentPage === i ? "active" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => handlePageClick(i)}
            >
              {i}
            </button>
          </li>
        );
      }

      if (totalPages > 5) {
        pages.push(
          <li key="ellipsis1" className="page-item int-pg-item disabled">
            <span className="page-link">...</span>
          </li>
        );
        pages.push(
          <li
            key={totalPages - 1}
            className={`page-item int-pg-item ${
              currentPage === totalPages - 1 ? "active" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => handlePageClick(totalPages - 1)}
            >
              {totalPages - 1}
            </button>
          </li>
        );

        pages.push(
          <li
            key={totalPages}
            className={`page-item int-pg-item ${
              currentPage === totalPages ? "active" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => handlePageClick(totalPages)}
            >
              {totalPages}
            </button>
          </li>
        );
      }
    } else {
      // When not on the first 3 pages or the last 2 pages
      pages.push(
        <li
          key={1}
          className={`page-item int-pg-item ${
            currentPage === 1 ? "active" : ""
          }`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
        </li>
      );

      pages.push(
        <li key="ellipsis2" className="page-item int-pg-item disabled">
          <span className="page-link">...</span>
        </li>
      );

      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(
          <li
            key={i}
            className={`page-item int-pg-item ${
              currentPage === i ? "active" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => handlePageClick(i)}
            >
              {i}
            </button>
          </li>
        );
      }

      pages.push(
        <li key="ellipsis3" className="page-item int-pg-item disabled">
          <span className="page-link">...</span>
        </li>
      );

      pages.push(
        <li
          key={totalPages}
          className={`page-item int-pg-item ${
            currentPage === totalPages ? "active" : ""
          }`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-md-center justify-content-center pagination-main-box flex-wrap mt-5">
      {/* <p className="my-0 mx-3">
        Showing {itemsPerPage > totalItems ? totalItems : itemsPerPage} of{" "}
        {totalItems} entries
      </p> */}
      <nav aria-label="Page int-pagination-main navigation ">
        <ul className="pagination  align-items-center justify-content-end">
          {/* <li className="page-item">
            <p className="my-0 mx-3">
              Showing {itemsPerPage > totalItems ? totalItems : itemsPerPage} of{" "}
              {totalItems} entries
            </p>
          </li> */}
          <li
            className={`page-item int-pg-item ${
              currentPage === 1 ? "disabled" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => handlePageClick(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </li>
          {renderPageNumbers()}
          <li
            className={`page-item int-pg-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => handlePageClick(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;

// import React from "react";

// const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, settotalPages] = useState(1);

//   // console.log(totalItems,"totalitems")

//   useEffect(() => {
//     onPageChange(currentPage);
//   }, [currentPage, onPageChange]);

//   useEffect(() => {
//     console.log(totalItems, "totalItems");
//     settotalPages(Math.ceil(totalItems / itemsPerPage));
//   }, [totalItems, itemsPerPage]);
//   return (
//     <div className="d-flex align-items-center justify-content-md-between justify-content-center  flex-wrap my-3">
//       <p className="mb-md-0 mb-3">Showing 11 of 100 entries</p>
//       <nav aria-label="Page navigation example">
//         <ul className="pagination">
//           <li className="page-item">
//             <a className="page-link" href="#" aria-label="Previous">
//               <span aria-hidden="true">«</span>
//               <span className="sr-only">Previous</span>
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               1
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               2
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               3
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#" aria-label="Next">
//               <span aria-hidden="true">»</span>
//               <span className="sr-only">Next</span>
//             </a>
//           </li>
//         </ul>
//         {/*end pagination*/}
//       </nav>
//     </div>
//   );
// };

// export default Pagination;
