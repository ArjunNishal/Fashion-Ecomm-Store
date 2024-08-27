import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import BreadcrumbPanel from "../../components/BreadcrumbPanel";
import PanelPagination from "../../components/PanelPagination";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, renderUrl } from "../../../config";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarlinks } from "../../components/dashboardconfig";
import ReviewCard from "./ReviewCard";

const SingleProductPanel = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pid = searchParams.get("pid");
  const navigate = useNavigate("");
  const [activeTab, setactiveTab] = useState("shortdesc");

  useEffect(() => {
    if (
      decoded.role !== "superadmin" &&
      !decoded.permissions.includes("Manage Products")
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

  useEffect(() => {
    if (!pid || pid === ("" || " ") || pid === undefined) {
      navigate(-1);
    }
  }, []);

  useEffect(() => {
    const page = sidebarlinks.find((el) => el.url === location.pathname);

    if (
      decoded.role !== "superadmin" &&
      !page.permission.some((el) => decoded.permissions.includes(el))
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  const [product, setproduct] = useState({});
  const [activeslide, setactiveslide] = useState(0);

  const fetchProduct = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(
        `panel/product/getproduct/${pid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setproduct(response.data.data);
      const productdetails = response.data.data;
      setloading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const toggleSurveyStatus = async (id, activate) => {
    try {
      const response = await axiosInstance.put(
        `panel/product/editproduct/status/${id}`,
        {
          status: activate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProduct();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "error",
      });
    }
  };

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ========= right pane =========*/}
      <div
        className={`main dashboard-main container-fluid ${
          isOpen ? "open" : ""
        }`}
        style={{ right: "0px" }}
        id="upload-div"
      >
        {/* =========topbar ========= */}
        <Topbar />

        <div className=" mt-md-2  mt-0">
          <BreadcrumbPanel
            breadlinks={[
              {
                url: "/panel_dashboard",
                text: "Home",
              },
              {
                url: "/panel_products",
                text: "Products",
              },
              {
                url: "/panel_product",
                text: `${product ? `${product?.productName}` : "Product"}`,
              },
            ]}
          />
          {loading && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {!loading && product && (
            <div className="single_product_main_card">
              <div className="card">
                <div className="card-body p-m-0">
                  <div className="single_product_body">
                    <div className="row mx-0 single_product_row">
                      <div className="col-12 p-m-0">
                        <div className="product_basic_info">
                          <div className="row mx-0">
                            <div className="col-lg-6 col-12 p-m-0">
                              <div className="single_product_left_pane">
                                <div className="single_product_images_slider">
                                  <div
                                    id="single_product_carousel"
                                    className="carousel slide"
                                    data-ride="false"
                                  >
                                    <div className="carousel-inner">
                                      <div className={`carousel-item active `}>
                                        <img
                                          src={`${renderUrl}uploads/product/${product.thumbnail}`}
                                          className="d-block w-100"
                                          alt="Product img"
                                        />
                                      </div>
                                      {product?.images?.map((image, index) => (
                                        <div
                                          key={index}
                                          className={`carousel-item`}
                                        >
                                          <img
                                            src={`${renderUrl}uploads/product/${image}`}
                                            className="d-block w-100"
                                            alt="Product img"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <a
                                      className="carousel-control-prev"
                                      href="#single_product_carousel"
                                      role="button"
                                      data-slide="prev"
                                      onClick={() => {
                                        let active = activeslide;
                                        let totalslides =
                                          product?.images?.length;
                                        if (product?.thumbnail) {
                                          totalslides = totalslides + 1;
                                        }

                                        if (active === 0) {
                                          setactiveslide(totalslides - 1);
                                        } else {
                                          setactiveslide(active - 1);
                                        }
                                      }}
                                    >
                                      <span
                                        className="carousel-control-prev-icon"
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">Previous</span>
                                    </a>
                                    <a
                                      className="carousel-control-next"
                                      href="#single_product_carousel"
                                      role="button"
                                      data-slide="next"
                                      onClick={() => {
                                        let active = activeslide;
                                        let totalslides =
                                          product?.images?.length;
                                        if (product?.thumbnail) {
                                          totalslides = totalslides + 1;
                                        }

                                        if (active + 1 === totalslides) {
                                          setactiveslide(0);
                                        } else if (active + 1 <= totalslides) {
                                          setactiveslide(active + 1);
                                        }
                                      }}
                                    >
                                      <span
                                        className="carousel-control-next-icon"
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">Next</span>
                                    </a>
                                  </div>
                                </div>
                                <div className="single_product_images_slider_indicators mt-2">
                                  <div className="single_product_indicators pb-2">
                                    <div
                                      data-target="#single_product_carousel"
                                      data-slide-to={0}
                                      className={`product_indicator thumbnail ${
                                        activeslide === 0 ? "active" : ""
                                      }`}
                                      onClick={() => setactiveslide(0)}
                                    >
                                      <img
                                        src={`${renderUrl}uploads/product/${product.thumbnail}`}
                                        className="product_indicator_img"
                                        alt="product"
                                      />
                                      <small>Thumbnail</small>
                                    </div>{" "}
                                    {product?.images?.map((indi, index) => {
                                      return (
                                        <div
                                          key={index}
                                          data-target="#single_product_carousel"
                                          data-slide-to={index + 1}
                                          className={`product_indicator ${
                                            activeslide === index + 1
                                              ? "active"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            setactiveslide(index + 1)
                                          }
                                        >
                                          <img
                                            src={`${renderUrl}uploads/product/${indi}`}
                                            className="product_indicator_img"
                                            alt="product"
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-12">
                              <div className="product_basic_details">
                                <div className="product_details_box">
                                  <div className="edit_product d-flex align-items-center justify-content-end text-right">
                                    <div className="product_status">
                                      {product?.status === 1 ? (
                                        <span className="badge badge-success">
                                          Active
                                        </span>
                                      ) : product?.status === 0 ? (
                                        <span className="badge badge-warning">
                                          Deactivated
                                        </span>
                                      ) : (
                                        <span className="badge badge-danger">
                                          Blocked
                                        </span>
                                      )}
                                      {/* <button className="btn btn-sm text-secondary">
                                <i className="far fa-edit"></i>
                              </button> */}
                                      <div className="btn-group">
                                        <button
                                          type="button"
                                          className="btn btn-sm text-secondary"
                                          data-toggle="dropdown"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                        >
                                          <i className="far fa-edit"></i>
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          {product?.status !== 1 && (
                                            <button
                                              className="dropdown-item"
                                              type="button"
                                              onClick={() =>
                                                toggleSurveyStatus(
                                                  product?._id,
                                                  1
                                                )
                                              }
                                            >
                                              <i className="fas fa-circle text-success"></i>{" "}
                                              Activate
                                            </button>
                                          )}
                                          {product?.status !== 0 && (
                                            <button
                                              className="dropdown-item"
                                              type="button"
                                              onClick={() =>
                                                toggleSurveyStatus(
                                                  product?._id,
                                                  0
                                                )
                                              }
                                            >
                                              <i className="fas fa-circle text-warning"></i>{" "}
                                              Deactivate
                                            </button>
                                          )}
                                          {product?.status !== 2 && (
                                            <button
                                              className="dropdown-item"
                                              type="button"
                                              onClick={() =>
                                                toggleSurveyStatus(
                                                  product?._id,
                                                  2
                                                )
                                              }
                                            >
                                              <i className="fas fa-circle text-danger"></i>{" "}
                                              Block
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {(decoded.role === "superadmin" ||
                                      decoded.permissions.includes(
                                        "Edit Products"
                                      )) && (
                                      <>
                                        {" "}
                                        <Link
                                          to={`/panel_editproduct?pid=${product._id}`}
                                          className="btn btn-sm btn-outline-primary"
                                        >
                                          <i className="fas fa-pen"></i> Edit
                                          Product
                                        </Link>{" "}
                                      </>
                                    )}
                                  </div>
                                  <h3 className="product_name">
                                    {product.productName}
                                  </h3>

                                  <div className="rating_wrap d-flex align-items-center mb_15 text-uppercase">
                                    <ul className="rating_star ul_li mr-2 clearfix">
                                      {[1, 2, 3, 4, 5].map((star, index) => (
                                        <li key={index}>
                                          {index + 1 < product?.totalRating ? (
                                            <i className="fas fa-star" />
                                          ) : index + 1 >
                                              product?.totalRating &&
                                            product?.totalRating > index ? (
                                            <i class="fas fa-star-half-alt"></i>
                                          ) : (
                                            <i className="far fa-star" />
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                    <span
                                      className="review_text"
                                      data-text-color="#ff3f3f"
                                    >
                                      ({product?.totalRating} Rating)
                                    </span>
                                  </div>

                                  <div className="product_categories">
                                    <small>
                                      <b>Categories</b>
                                    </small>
                                    <div className="d-flex flex-wrap">
                                      {product?.categories?.map(
                                        (cat, index) => (
                                          <span
                                            key={index}
                                            className="badge mr-2 shadow-sm badge-primary"
                                          >
                                            {cat.name}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <div className="product_price_panel py-2">
                                    <span className="">
                                      {/* /actual and discounted price */}
                                      <del>₹{product?.actualPrice}</del>{" "}
                                      <strong>₹{product?.price}</strong>
                                    </span>
                                  </div>
                                  <div className="quantity_left_box">
                                    <p>
                                      <b>Quantity in stock - </b>20
                                    </p>
                                  </div>
                                  <div className="products_sizes">
                                    {product?.products?.map((item, index) => (
                                      <div
                                        className={`product_size_details mb-2 p-2 ${
                                          product.products.length > 1
                                            ? "border rounded"
                                            : ""
                                        }`}
                                      >
                                        {product.products.length > 1 && (
                                          <p className="m-0 text-panel">
                                            <b>
                                              {index + 1}. {item.productName}
                                            </b>
                                          </p>
                                        )}
                                        <small>
                                          <b>Sizes</b>
                                        </small>
                                        <div className="sizes_flex_box">
                                          {item?.sizes?.map(
                                            (size, sizeIndex) => (
                                              <div className="size_box text-uppercase">
                                                {size?.shortform}
                                              </div>
                                            )
                                          )}
                                        </div>
                                        <small>
                                          <b>Colors</b>
                                        </small>
                                        <div className="sizes_flex_box">
                                          {item?.colors?.map(
                                            (color, colorIndex) => (
                                              <div className="color_box">
                                                <i
                                                  style={{
                                                    color: `${color.code}`,
                                                  }}
                                                  className="fas fa-circle"
                                                ></i>
                                                <p className="m-0">
                                                  <small>{color.name}</small>
                                                </p>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <hr />
                        <div className="product_description_reviews_wrapper">
                          <div className="description_tabs">
                            <div className="sports_description_tab mb_100">
                              <ul
                                className="nav justify-content-md-center sticky_tab_pills_panel justify-content-around text-uppercase"
                                role="tablist"
                              >
                                <li>
                                  <a
                                    className="active "
                                    data-toggle="tab"
                                    href="#shortDescription_tab"
                                  >
                                    Short Description
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className=" "
                                    data-toggle="tab"
                                    href="#description_tab"
                                  >
                                    Description
                                  </a>
                                </li>
                                {/* <li>
                          <a data-toggle="tab" href="#information_tab">
                            Additional Information
                          </a>
                        </li> */}
                                <li>
                                  <a
                                    data-toggle="tab"
                                    className=""
                                    href="#review_tab"
                                  >
                                    Reviews ({product?.reviews?.length})
                                  </a>
                                </li>
                              </ul>
                              <div className="tab-content">
                                <div
                                  id="shortDescription_tab"
                                  className="tab-pane ck-content active"
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: product?.shortDescription,
                                    }}
                                    className="description"
                                  ></div>
                                </div>
                                <div
                                  id="description_tab"
                                  className="tab-pane ck-content "
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: product?.description,
                                    }}
                                    className="description"
                                  ></div>
                                </div>

                                <div id="review_tab" className="tab-pane fade">
                                  <div className="revies_tab">
                                    <div className="reviews_row row mx-0">
                                      {product?.reviews?.map(
                                        (rev, revIndex) => {
                                          const normalizedRating = Math.min(
                                            Math.max(rev.rating, 0),
                                            5
                                          );
                                          const stars = [];

                                          for (let i = 1; i <= 5; i++) {
                                            if (i <= normalizedRating) {
                                              stars.push(
                                                <li key={i}>
                                                  {" "}
                                                  <i className="fas fa-star"></i>
                                                </li>
                                              );
                                            } else if (
                                              i - 0.5 ===
                                              normalizedRating
                                            ) {
                                              stars.push(
                                                <li key={i}>
                                                  <i className="fas fa-star-half-alt"></i>
                                                </li>
                                              );
                                            } else {
                                              stars.push(
                                                <li key={i}>
                                                  {" "}
                                                  <i className="far fa-star"></i>
                                                </li>
                                              );
                                            }
                                          }
                                          return (
                                            <div
                                              key={revIndex}
                                              className="col-12"
                                            >
                                              <ReviewCard
                                                getproduct={fetchProduct}
                                                rev={rev}
                                                productId={product._id}
                                                stars={stars}
                                              />
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default SingleProductPanel;
