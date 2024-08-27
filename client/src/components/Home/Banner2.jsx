import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { renderUrl } from "../../config";
import { Link } from "react-router-dom";

const Banner2 = ({ products }) => {
  const settings = {
    dots: true,
    speed: 1000,
    arrows: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 3,
    pauseOnHover: true,
    autoplaySpeed: 4000,
    prevArrow: (
      <button type="button" className="ss3_left_arrow">
        {/* <i className="fal fa-arrow-left" /> */}
      </button>
    ),
    nextArrow: (
      <button type="button" className="ss3_right_arrow">
        {/* <i className="fal fa-arrow-right" /> */}
      </button>
    ),
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
  return (
    <section
      className="sports_feature_section sec_ptb_140 parallaxie clearfix"
      data-background="assets/images/backgrounds/bg_32.jpg"
    >
      <div className="container">
        <div className="sports_section_title text-center mb_100">
          <span className="sub_title mb-0">
            Hugo &amp; Marie is an independent
          </span>
          <h2 className="title_text text-uppercase mb-0 text-white">
            FEATURE PRODUCTS
          </h2>
          <strong
            className="big_title text-uppercase"
            data-text-color="rgba(0, 0, 0, 0.05)"
          >
            Sport
          </strong>
        </div>
        <div className="sports_feature_carousel position-relative arrow_ycenter">
          <Slider {...settings}>
            {products?.map((item, index) => (
              <div
                key={index}
                className="sports_feature_split item position-relative text-white text-uppercase"
                data-bg-color="#000000"
              >
                {index % 2 === 0 ? (
                  <>
                    {/* Image on top for even index */}
                    <div className="item_image">
                      <img
                        src={`${renderUrl}uploads/product/${item?.thumbnail}`}
                        alt="image_not_found"
                      />
                      <Link
                        className="details_btn"
                        to={`/product/${item?._id}`}
                      >
                        <i className="fal fa-arrow-right" />
                      </Link>
                    </div>
                    {/* Content below for even index */}
                    <div className="item_content">
                      <div className="content_wrap">
                        <span className="sub_title">
                          <del>&#8377;{item?.actualPrice}</del> &#8377;
                          {item?.price}
                        </span>
                        <h3 className="item_title text-white mb-0">
                          {item?.productName}
                        </h3>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Content on top for odd index */}
                    <div className="item_content">
                      <div className="content_wrap">
                        <span className="sub_title">
                          {" "}
                          <del>&#8377;{item?.actualPrice}</del> &#8377;
                          {item?.price}
                        </span>
                        <h3 className="item_title text-white mb-0">
                          {item?.productName}
                        </h3>
                      </div>
                    </div>
                    {/* Image below for odd index */}
                    <div className="item_image">
                      <img
                        src={`${renderUrl}uploads/product/${item?.thumbnail}`}
                        alt="image_not_found"
                      />
                      <Link
                        className="details_btn"
                        to={`/product/${item?._id}`}
                      >
                        <i className="fal fa-arrow-right" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* <div
              className="sports_feature_split item position-relative text-white text-uppercase"
              data-bg-color="#000000"
            >
              <div className="item_image">
                <img
                  src="/assets/images/feature/sports/img_02.jpg"
                  alt="image_not_found"
                />
                <a className="details_btn" href="#!">
                  <i className="fal fa-arrow-right" />
                </a>
              </div>
              <div className="item_content">
                <div className="content_wrap">
                  <span className="sub_title">30% Off This Week</span>
                  <h3 className="item_title text-white mb-0">
                    NIKE CLUB HOODIE &amp; MORE
                  </h3>
                </div>
              </div>
            </div>
            <div
              className="sports_feature_split item position-relative text-white text-uppercase"
              data-bg-color="#000000"
            >
              {" "}
              <div className="item_content">
                <div className="content_wrap">
                  <span className="sub_title">Special Products</span>
                  <h3 className="item_title text-white mb-0">
                    KEEP YOUR FEET COOL AND COMFY
                  </h3>
                </div>
              </div>
              <div className="item_image">
                <img
                  src="/assets/images/feature/sports/img_03.jpg"
                  alt="image_not_found"
                />
                <a className="details_btn" href="#!">
                  <i className="fal fa-arrow-right" />
                </a>
              </div>
            </div>
            <div
              className="sports_feature_split item position-relative text-white text-uppercase"
              data-bg-color="#000000"
            >
              <div className="item_image">
                <img
                  src="/assets/images/feature/sports/img_02.jpg"
                  alt="image_not_found"
                />
                <a className="details_btn" href="#!">
                  <i className="fal fa-arrow-right" />
                </a>
              </div>
              <div className="item_content">
                <div className="content_wrap">
                  <span className="sub_title">30% Off This Week</span>
                  <h3 className="item_title text-white mb-0">
                    NIKE CLUB HOODIE &amp; MORE
                  </h3>
                </div>
              </div>
            </div> */}
            {/* Repeat the other items similarly */}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Banner2;
