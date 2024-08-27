import React, { useEffect, useState } from "react";
import { axiosInstance, renderUrl } from "../../../config";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import moment from "moment";
import PanelPagination from "../../components/PanelPagination";

const SelectProducts = ({ productForm, setproductForm }) => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(60);
  const [products, setProducts] = useState([]);
  const [searchvalue, setsearchvalue] = useState("");
  const [loading, setloading] = useState(false);

  const fetchProducts = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(`panel/product/getallproducts`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          options: {
            status: 1,
          },
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setProducts(response.data.data.results);
      setTotalPages(response.data.data.totalRecord);
      setloading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async (val) => {
    try {
      setloading(true);
      const apiUrl = "panel/user/search";
      const modelName = "Product";

      let mongodbQuery;

      let populateOptions = [
        { path: "createdby", model: "Admin" },
        { path: "categories", model: "Category" },
      ];

      //   if (decoded.role === "superadmin") {
      mongodbQuery = {
        $or: [{ productName: { $regex: val, $options: "i" } }],
        //   role: "admin",
      };
      //   }

      console.log(mongodbQuery, "mongodbQuery");

      const response = await axiosInstance.post(
        apiUrl,
        {
          query: mongodbQuery,
          model: modelName,
          populateOptions: populateOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data, "members search");
        setProducts(response.data.data);
        // setSearchResults(response.data.data);
      } else {
        console.error("Error:", response.data.message);
      }
      setloading(false);
    } catch (error) {
      console.error("Error:", error);
      setloading(false);
    }
  };

  const handlesearchevent = (e) => {
    const value = e.target.value;
    if (value === "") {
      fetchProducts();
    } else if (value !== "" && value) {
      handleSearch(value);
    }
    setsearchvalue(value);
  };

  const handlecheckChange = (e) => {
    const { value, checked } = e.target;

    setproductForm((prevState) => ({
      ...prevState,
      selectedproducts: checked
        ? [...prevState.selectedproducts, value]
        : prevState.selectedproducts.filter((id) => id !== value),
    }));
  };

  return (
    <div className="col-12">
      <hr />
      <div className="newsletterproducts_table">
        <div className="card table_card border-0 shadow">
          <div className="card-header row mx-0 align-items-sm-center align-items-end border-0">
            <h6 className="col-md-4 col-12">Select Products</h6>
            <div className="col-md-8 col-12">
              <div className="d-flex flex-sm-row flex-column align-items-center justify-content-end w-100">
                <div className="searchform_panel my-sm-0 my-2 mr-sm-1">
                  <div className="search_box">
                    <div className="input-group ">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text border-right-0 bg-transparent"
                          id="basic-addon1"
                        >
                          <i className="fas fa-search"></i>
                        </span>
                      </div>

                      <input
                        type="search"
                        name="search"
                        value={searchvalue}
                        onChange={(e) => {
                          handlesearchevent(e);
                        }}
                        className="form-control border-left-0 shadow-none"
                        placeholder={`Search...`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table_div table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Action</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Created By</th>
                  <th>Date</th>
                </tr>
              </thead>
              {!loading && (
                <tbody>
                  {products?.map((admin, index) => (
                    <tr
                      className={`${
                        productForm.selectedproducts.includes(admin._id)
                          ? "table-info"
                          : ""
                      }`}
                      key={admin._id}
                    >
                      <td scope="row">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>
                        <div className="checkbox_item mb-0 pl-0">
                          <label htmlFor="check_payments">
                            <input
                              id="check_payments"
                              type="checkbox"
                              value={admin._id}
                              checked={productForm.selectedproducts.includes(
                                admin._id
                              )}
                              name="productcheck"
                              onChange={handlecheckChange}
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <img
                          className="table_cat_img"
                          src={
                            admin?.thumbnail
                              ? `${renderUrl}uploads/product/${admin?.thumbnail}`
                              : `${renderUrl}uploads/product/${admin?.images[0]}`
                          }
                          alt="product"
                        />
                        <Link
                          to={`/panel_product?pid=${admin._id}`}
                          className="text-panel"
                        >
                          {admin.productName}
                        </Link>
                      </td>
                      <td>
                        <del>&#8377;{admin.actualPrice}</del>{" "}
                        <strong>&#8377;{admin.price}</strong>
                      </td>
                      <td>
                        {admin?.createdby?.username || "N/A"} <br />{" "}
                        <small>
                          {admin?.createdby?.role === "superadmin"
                            ? "(Super Admin)"
                            : admin?.createdby?.role === "admin"
                            ? "(Admin)"
                            : ""}
                        </small>
                      </td>
                      {/* <td>{admin.lastName}</td> */}
                      <td>{moment(admin?.createdAt).format("Do MMMM YYYY")}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          {loading && (
            <div className="d-flex justify-content-center py-3">
              <div className="spinner-border text-panel" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {products.length === 0 && (
            <>
              <div className="text-center">
                <small className="text-small">No Products Found</small>
              </div>
            </>
          )}

          {searchvalue === "" && (
            <div className="row pagination_row mb-2 mx-0 mt-2">
              <div className="col-md-6 col-12">
                <p className="mb-0 pagination_entries">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {itemsPerPage * currentPage > totalPages
                    ? totalPages
                    : itemsPerPage * currentPage}{" "}
                  of {totalPages} Entries
                </p>
              </div>
              <div className="col-md-6 col-12">
                <div className="text-md-right text-center">
                  <PanelPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectProducts;
