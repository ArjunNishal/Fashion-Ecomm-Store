import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../ProductCard";
import { renderUrl } from "../../config";
import { Link } from "react-router-dom";

const FeatureOffers = ({ products }) => {
  const sliderRef = React.useRef(null);

  const settings4 = {
    dots: true,
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
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 551,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const settingsslider2 = {
    dots: true,
    speed: 1000,
    arrows: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
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

  const [topProducts, setTopProducts] = useState([]);
  console.log(topProducts, "top products");

  const filterTopDiscountedProducts = (data, topN = 3) => {
    // Extract all products from the categories and flatten them into a single array
    const allProducts = data.reduce((acc, category) => {
      return acc.concat(category.products);
    }, []);

    // Sort the products based on the `discount` field in descending order
    allProducts.sort((a, b) => b.discount - a.discount);

    // Return only the top N products
    setTopProducts(allProducts.slice(0, topN));
  };

  useEffect(() => {
    filterTopDiscountedProducts(products);
  }, [products]);

  return (
    <section className="feature_product_section  sec_ptb_140 clearfix">
      {" "}
      <div className="container">
        <div className="sports_section_title text-center mb_100">
          <span className="sub_title mb-0">
            Hugo &amp; Marie is an independent
          </span>
          <h2 className="title_text text-uppercase mb-0">Great Offers</h2>
          <strong
            className="big_title text-uppercase"
            data-text-color="rgba(0, 0, 0, 0.05)"
          >
            Sport
          </strong>
        </div>
        <div className="row mx-0 justify-content-lg-between justify-content-md-center justify-content-sm-center">
          <div className="col-lg-6 col-md-8 col-sm-10 col-xs-12">
            <div className="sfp_wrap d-md-block d-none">
              {topProducts.map((el, index) => (
                <div
                  key={index}
                  className="sports_feature_product"
                  data-bg-color="#f4f4f4"
                >
                  <Link
                    className="item_image"
                    to={`/product/${el._id}`}
                    data-bg-color="#ffffff"
                  >
                    <img
                      src={`${renderUrl}uploads/product/${el.thumbnail}`}
                      alt="image_not_found"
                    />
                  </Link>
                  <div className="item_content">
                    <span className="item_price">
                      {el.discount}% OFF - ₹{el.price}
                    </span>
                    <h3 className="item_title text-uppercase">
                      <Link to={`/product/${el._id}`}>{el.productName}</Link>
                    </h3>
                    {el.totalRating >= 0 && (
                      <div className="rating_wrap d-flex align-items-center text-uppercase">
                        <ul className="rating_star ul_li mr-2 clearfix">
                          {[1, 2, 3, 4, 5].map((star, index) => (
                            <li>
                              {index + 1 < el?.totalRating ? (
                                <i key={index} className="fas fa-star" />
                              ) : index + 1 > el?.totalRating &&
                                el?.totalRating > index ? (
                                <i key={index} class="fas fa-star-half-alt"></i>
                              ) : (
                                <i key={index} className="far fa-star" />
                              )}
                            </li>
                          ))}
                        </ul>
                        <span className="review_text">
                          ({el.totalRating} Rating)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="abtn_wrap">
                <Link
                  className="text_btn text-uppercase"
                  to="/productslist/all"
                >
                  <span>Explore Now</span>
                </Link>
              </div>
            </div>
            <div className="d-md-none d-block">
              <div className="featured-products-mob-wrapper">
                <Slider className="col-12 p-0" {...settings4}>
                  {topProducts.map((el, index) => (
                    <div key={index} className="py-2 px-md-3 px-2">
                      <ProductCard product={el} id={el._id} />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-8 col-sm-10 col-xs-12">
            <div className="sf_product_carousel position-relative">
              <div className="slideshow1_slider" data-slick='{"dots": false}'>
                <Slider ref={sliderRef} {...settingsslider2}>
                  {topProducts.map((el, index) => (
                    <div key={index} className="sports_product_fullimage">
                      <img
                        src={`${renderUrl}uploads/product/${el.thumbnail}`}
                        alt="image_not_found"
                      />
                      <div className="item_content text-uppercase text-white">
                        <h3 className="item_title bg_black text-white mb-0">
                          {el.productName}
                        </h3>
                        <span className="item_price bg_sports_red">
                          <strong>₹{el.productName}</strong>{" "}
                          <del>₹{el.productName}</del>
                        </span>
                        <div className="btn_wrap clearfix">
                          <Link
                            className="text_btn text-uppercase"
                            to={`/product/${el._id}`}
                          >
                            <span>Explore Now</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
              <div className="carousel_nav">
                <button
                  type="button"
                  className="left_arrow"
                  onClick={() => sliderRef.current.slickPrev()}
                >
                  <i className="fal fa-arrow-left" />
                </button>
                <button
                  type="button"
                  className="right_arrow"
                  onClick={() => sliderRef.current.slickNext()}
                >
                  <i className="fal fa-arrow-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </section>
  );
};

export default FeatureOffers;
