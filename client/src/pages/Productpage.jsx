import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ImageSlider from "../components/Product/ImageSlider";
import useScrollTo from "../components/useScrollTo";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { axiosInstance, renderUrl } from "../config";
import ReviewForm from "../components/Product/ReviewForm";
import ReviewCardWeb from "../components/Product/ReviewCardWeb";
import { jwtDecode } from "jwt-decode";
import ReviewList from "../components/Product/ReviewList";
import RelatedProducts from "../components/Product/RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAPI,
  decreaseQuantityAPI,
  increaseQuantityAPI,
  removeFromCartAPI,
  removeFromCartLocal,
} from "../Redux/reducers/cartSlice";

const Productpage = () => {
  const [token, settoken] = useState("");
  const [decoded, setdecoded] = useState({});
  const [loading, setloading] = useState(false);
  const [activeTab, setactiveTab] = useState("description_tab");
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);

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

  const settings4 = {
    dots: false,
    speed: 1000,
    arrows: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 3,
    pauseOnHover: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 551,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [product, setproduct] = useState({});
  const [showreviewform, setshowreviewform] = useState(false);
  const [fetchreviews, setfetchreviews] = useState(false);

  const selector = "product-details";
  useScrollTo(selector);
  const { pid } = useParams();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const [cid, setcid] = useState(searchParams.get("cid") || "Category");
  // const pid = searchParams.get("pid");
  // console.log(cid === "undefined", cid === undefined);
  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: `/productslist/${
        cid && cid !== ("undefined" || undefined || null || "") ? cid : "all"
      }`,
      text: "Category",
    },
    {
      url: "/product",
      text: "Product",
    },
  ];

  // fetch product
  const fetchproduct = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.get(
        `client/product/singleproduct/${pid}`
      );
      // console.log(response.data);
      setproduct(response.data.data);
      setselectedItem({
        ...selectedItem,
        product: response.data.data,
      });
      setloading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    if (pid) {
      fetchproduct();
    }
  }, []);

  useEffect(() => {
    fetchproduct();
  }, [pid]);

  // console.log(product?.images, product, pid, "product?.images");

  // REDUX actions -------------------------------------------------------------------

  const [selectedItem, setselectedItem] = useState({
    product: product,
    size: [],
    // size element will have - product item id & size details
    color: [],
    quantity: 0,
  });

  const [cartError, setCarterror] = useState({});

  const [editing, setediting] = useState(false);

  // useEffect(() => {
  //   console.log(selectedItem, "selectedItem .....................");
  //   // alert(selectedItem.quantity);
  // }, [selectedItem]);
  // console.log(selectedItem, "selectedItem .....................");

  const checkerrorsBeforeadding = () => {
    let hasError = false;
    // alert("checkerrorsBeforeadding");

    if (selectedItem.size.length !== product.products.length) {
      setCarterror((prevCartErrors) => ({
        ...prevCartErrors,
        size: "Please Select a Size for this item",
      }));
      hasError = true;
    } else {
      setCarterror((prevCartErrors) => ({
        ...prevCartErrors,
        size: "",
      }));
    }

    if (selectedItem.color.length !== product.products.length) {
      setCarterror((prevCartErrors) => ({
        ...prevCartErrors,
        color: "Please Select a Color for this item",
      }));
      hasError = true;
    } else {
      setCarterror((prevCartErrors) => ({
        ...prevCartErrors,
        color: "",
      }));
    }

    return !hasError;
  };

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    // alert("called");
    // Find matching item in the cart
    const matchingItem = cartItems.find((item) => {
      const isProductMatch = item.product._id === selectedItem.product._id;
      const isSizeMatch = item.size.every(
        (size, index) => size.sizeId === selectedItem.size[index]?.sizeId
      );
      const isColorMatch = item.color.every(
        (color, index) => color.colorId === selectedItem.color[index]?.colorId
      );

      return isProductMatch && isSizeMatch && isColorMatch;
    });

    if (matchingItem) {
      setselectedItem((prevSelectedItem) => ({
        ...prevSelectedItem,
        quantity: matchingItem.quantity,
      }));
    }
  }, [
    cartItems,
    cartData,
    selectedItem.product._id,
    selectedItem.size,
    selectedItem.color,
  ]);

  useEffect(() => {
    // alert("called");
    // Find matching item in the cart
    const matchingItem = cartItems.find((item) => {
      const isProductMatch = item.product._id === selectedItem.product._id;
      const isSizeMatch = item.size.every(
        (size, index) => size.sizeId === selectedItem.size[index]?.sizeId
      );
      const isColorMatch = item.color.every(
        (color, index) => color.colorId === selectedItem.color[index]?.colorId
      );

      return isProductMatch && isSizeMatch && isColorMatch;
    });

    if (matchingItem) {
      setselectedItem((prevSelectedItem) => ({
        ...prevSelectedItem,
        quantity: matchingItem.quantity,
      }));
    } else {
      setselectedItem((prevSelectedItem) => ({
        ...prevSelectedItem,
        size: [],
        color: [],
        quantity: 0,
      }));
    }
  }, [cartItems]);

  const handleAddToCart = () => {
    if (checkerrorsBeforeadding()) {
      setediting(true);
      const updatedItem = {
        ...selectedItem,
        quantity: selectedItem.quantity + 1,
      };
      // alert("handleAddToCart");
      dispatchfunc(updatedItem);
      // setselectedItem(updatedItem);
      setediting(false);
    }
  };

  const dispatchfunc = (item) => {
    // alert("called dispatch on page");
    dispatch(addToCartAPI(item));
  };

  const handleIncrement = () => {
    setediting(true);
    const addedqty = selectedItem.quantity + 1;
    const updatedItem = { ...selectedItem, quantity: addedqty };

    console.log(updatedItem, "updatedItem");

    // Set the local state first
    // setselectedItem(updatedItem);

    // Dispatch the action after the state has been updated
    dispatch(increaseQuantityAPI(updatedItem)).then(() => {
      setediting(false);
    });
  };

  const handleDecrement = () => {
    if (selectedItem.quantity > 0) {
      setediting(true);
      let decQty = selectedItem.quantity - 1;
      const updatedItem = {
        product: selectedItem.product,
        size: selectedItem.size,
        color: selectedItem.color,
        quantity: decQty,
      };
      // alert("handleDecrement");
      // console.log(updatedItem, "updatedItem");
      dispatch(decreaseQuantityAPI(updatedItem));
      // setselectedItem(updatedItem);
      setediting(false);
    }
  };

  const handleRemoveCart = () => {
    setediting(true);

    setselectedItem((prevState) => {
      const updatedItem = {
        product: product,
        size: [],
        // size element will have - product item id & size details
        color: [],
        quantity: 0,
      };
      dispatch(removeFromCartAPI(prevState));
      return updatedItem;
    });
    setediting(false);
  };

  return (
    <div>
      {" "}
      <div>
        <Header />
        {/* <ScrollToTop /> */}
        <div className="productpage-main">
          <Breadcrumb
            pagename={"Product"}
            breadcrumbitems={breadlinks}
            backgroundimg={"/assets/images/breadcrumb/bg_14.jpg"}
          />

          <div id="product-details">
            {/* sports_details - start
			================================================== */}

            <section className="sports_details product-page-section sec_ptb_100 pb-5 mb-5 clearfix">
              <div className="container">
                <div className="row justify-content-lg-between">
                  <div className="col-lg-12">
                    <div className="row mb_100 bg-black-m justify-content-lg-between">
                      <div className="col-lg-6 col-md-6 d-md-block d-none">
                        {loading && (
                          <div class="d-flex justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}

                        {product?.images && !loading && (
                          <ImageSlider images={product?.images} />
                        )}
                      </div>
                      <div className="d-md-none d-block col-12 px-0 mob-product-slider">
                        <div className="mobile-product-apge-slider">
                          {loading && (
                            <div class="d-flex justify-content-center">
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          )}
                          {!loading && (
                            <>
                              {" "}
                              {product?.images && (
                                <Slider {...settings4}>
                                  {product?.images.map((image, index) => {
                                    const imageurl = `${renderUrl}uploads/product/${image}`;
                                    return (
                                      <div
                                        key={index}
                                        className="mob-product-slider-item"
                                      >
                                        <img src={imageurl} alt="img" />
                                      </div>
                                    );
                                  })}
                                </Slider>
                              )}{" "}
                            </>
                          )}
                        </div>
                      </div>
                      {/* right section */}
                      <div className="col-lg-6 col-md-6 product-page-details-wrapper">
                        {loading && (
                          <div class="d-flex justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}
                        {!loading && (
                          <div className="details_content">
                            {/* category */}
                            {/* <span className="item_type">Tshirts</span> */}
                            <h2 className="item_title mb_15">
                              {product.productName}
                            </h2>
                            {/* rating */}
                            {product?.reviews?.length > 0 && (
                              <div className="rating_wrap d-flex align-items-center mb_15 text-uppercase">
                                <ul className="rating_star ul_li mr-2 clearfix">
                                  {[1, 2, 3, 4, 5].map((star, index) => (
                                    <li key={index}>
                                      {index + 1 < product?.totalRating ? (
                                        <i className="fas fa-star" />
                                      ) : index + 1 > product?.totalRating &&
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
                            )}
                            {/* small description */}
                            <p className="mb_15">{product.note}</p>
                            <span className="product_price mb_30">
                              {/* /actual and discounted price */}
                              <del>₹{product.actualPrice}</del>{" "}
                              <strong>₹{product.price}</strong>
                            </span>
                            {/* size */}
                            {product?.products?.map((item, index) => {
                              // Check if the size or color for the current item is selected
                              const isSizeSelected = selectedItem.size.some(
                                (el) => el.id === item._id
                              );
                              const isColorSelected = selectedItem.color.some(
                                (el) => el.id === item._id
                              );

                              return (
                                <div
                                  key={index}
                                  className="products_list_single_page"
                                >
                                  <h4>
                                    {product.products.length > 1
                                      ? `${index + 1} `
                                      : ""}
                                    {item.productName}
                                  </h4>

                                  <div className="item_size d-flex align-items-center mb_30">
                                    <h4 className="list_title text-uppercase mb-0 mr-3">
                                      Size:
                                    </h4>
                                    <ul className="ul_li clearfix">
                                      {item?.sizes?.map((size, index) => (
                                        <li key={index}>
                                          <button
                                            title={`${size?.fullform}`}
                                            type="button"
                                            onClick={() => {
                                              if (
                                                selectedItem.size.some(
                                                  (el) => el.sizeId === size._id
                                                )
                                              ) {
                                                return;
                                              } else {
                                                setselectedItem(
                                                  (prevSelectedItem) => {
                                                    // Filter out any existing size for the same item ID
                                                    const updatedSizes =
                                                      prevSelectedItem.size.filter(
                                                        (el) =>
                                                          el.id !== item._id
                                                      );

                                                    // Add the new size
                                                    return {
                                                      ...prevSelectedItem,
                                                      size: [
                                                        ...updatedSizes,
                                                        {
                                                          id: item._id,
                                                          fullform:
                                                            size.fullform,
                                                          shortform:
                                                            size.shortform,
                                                          sizeId: size._id,
                                                        },
                                                      ],
                                                      quantity: 0,
                                                    };
                                                  }
                                                );
                                              }
                                            }}
                                            className={`${
                                              selectedItem.size.some(
                                                (el) => el.sizeId === size._id
                                              )
                                                ? "active"
                                                : ""
                                            }`}
                                          >
                                            {size?.shortform}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Show size error only if size is not selected for this item */}
                                  {!isSizeSelected && cartError.size && (
                                    <p>
                                      <small className="text-danger">
                                        {cartError.size}*
                                      </small>
                                    </p>
                                  )}

                                  <div className="item_size colors_map_div d-flex align-items-start mb_30">
                                    <h4 className="list_title text-uppercase mb-0 mr-3">
                                      Colors:
                                    </h4>
                                    <ul className="ul_li clearfix">
                                      {item?.colors?.map((color, index) => (
                                        <li
                                          className={`text-center ${
                                            selectedItem.color.some(
                                              (el) => el.colorId === color._id
                                            )
                                              ? "active color-selected"
                                              : ""
                                          }`}
                                          key={index}
                                        >
                                          <button
                                            onClick={() => {
                                              if (
                                                selectedItem.color.some(
                                                  (el) =>
                                                    el.colorId === color._id
                                                )
                                              ) {
                                                return;
                                              } else {
                                                setselectedItem(
                                                  (prevSelectedItem) => {
                                                    const updatedColors =
                                                      prevSelectedItem.color.filter(
                                                        (el) =>
                                                          el.id !== item._id
                                                      );

                                                    return {
                                                      ...prevSelectedItem,
                                                      color: [
                                                        ...updatedColors,
                                                        {
                                                          id: item._id,
                                                          code: color.code,
                                                          name: color.name,
                                                          colorId: color._id,
                                                        },
                                                      ],
                                                      quantity: 0, // Reset quantity to 1
                                                    };
                                                  }
                                                );
                                              }
                                            }}
                                            style={{
                                              backgroundColor: `${color?.code}`,
                                            }}
                                            type="button"
                                          ></button>

                                          <p>{color?.name}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Show color error only if color is not selected for this item */}
                                  {!isColorSelected && cartError.color && (
                                    <p>
                                      <small className="text-danger">
                                        {cartError.color}*
                                      </small>
                                    </p>
                                  )}

                                  {index + 1 === product.products.length ? (
                                    ""
                                  ) : (
                                    <hr />
                                  )}
                                </div>
                              );
                            })}

                            <ul className="btns_group ul_li clearfix">
                              {selectedItem.quantity > 0 && (
                                <>
                                  <li>
                                    <div className="quantity_input">
                                      <div>
                                        <span
                                          onClick={() => {
                                            if (!editing) {
                                              handleDecrement();
                                            }
                                          }}
                                          className="input_number_decrement"
                                        >
                                          –
                                        </span>
                                        <input
                                          className="input_number"
                                          type="text"
                                          value={selectedItem.quantity}
                                          // defaultValue={1}
                                        />
                                        <span
                                          onClick={() => {
                                            if (!editing) {
                                              handleIncrement();
                                            }
                                          }}
                                          className="input_number_increment"
                                        >
                                          +
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <button
                                      title="Remove Item"
                                      onClick={handleRemoveCart}
                                      className="btn btn-outline-danger"
                                    >
                                      <i class="fal fa-trash-alt"></i>
                                    </button>
                                  </li>
                                </>
                              )}
                              {selectedItem.quantity === 0 ? (
                                <li>
                                  <button
                                    onClick={() => {
                                      handleAddToCart();
                                    }}
                                    className="custom_btn bg_sports_red text-uppercase"
                                  >
                                    Add To Cart
                                  </button>
                                </li>
                              ) : (
                                ""
                              )}
                            </ul>
                            {selectedItem.quantity > 0 && (
                              <div>
                                <Link
                                  to={`/cart`}
                                  className="custom_btn mt-3 mr-2 bg_black text-uppercase"
                                >
                                  Go To Cart
                                </Link>
                                <Link
                                  to={`/checkout`}
                                  className="custom_btn mt-3 bg_black text-uppercase"
                                >
                                  Checkout
                                </Link>
                              </div>
                            )}
                            <hr />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sports_description_tab mb_100">
                      <ul
                        className="nav desctab_div justify-content-md-center justify-content-around text-uppercase"
                        role="tablist"
                      >
                        <li>
                          <a
                            className="active "
                            data-toggle="tab"
                            href="#description_tab"
                            onClick={() => setactiveTab("description_tab")}
                          >
                            Description
                          </a>
                        </li>
                        <li>
                          <a
                            data-toggle="tab"
                            className=""
                            href="#review_tab"
                            onClick={() => setactiveTab("review_tab")}
                          >
                            Reviews ({product?.reviews?.length})
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          id="description_tab"
                          className={`tab-pane ${
                            activeTab === "description_tab" ? "active" : "fade"
                          }`}
                        >
                          {loading && (
                            <div class="d-flex justify-content-center">
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          )}
                          {!loading && (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: product?.shortDescription,
                                }}
                                className="ck-content"
                              ></div>
                              <br />
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: product?.description,
                                }}
                                className="ck-content"
                              ></div>
                            </>
                          )}
                        </div>

                        <div
                          id="review_tab"
                          className={`tab-pane ${
                            activeTab === "review_tab" ? "active" : "fade"
                          }`}
                        >
                          {loading && (
                            <div class="d-flex justify-content-center">
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          )}

                          {!loading && (
                            <>
                              <ReviewList
                                decoded={decoded}
                                setfetchreviews={setfetchreviews}
                                fetchreviews={fetchreviews}
                                setproduct={setproduct}
                                fetchproduct={fetchproduct}
                                product={product}
                                setshowreviewform={setshowreviewform}
                              />
                              <ReviewForm
                                setproduct={setproduct}
                                setfetchreviews={setfetchreviews}
                                fetchreviews={fetchreviews}
                                fetchproduct={fetchproduct}
                                product={product}
                                showreviewform={showreviewform}
                                setshowreviewform={setshowreviewform}
                              />{" "}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* related products */}
                    <RelatedProducts categories={product.categories} />
                  </div>
                </div>
              </div>
            </section>

            {/* sports_details - end
			================================================== */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Productpage;
