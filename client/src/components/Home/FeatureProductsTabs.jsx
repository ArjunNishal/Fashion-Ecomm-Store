import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../ProductCard";

const FeatureProductsTabs = ({ products }) => {
  const settings3 = {
    dots: true,
    speed: 1000,
    arrows: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 3,
    pauseOnHover: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
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
        breakpoint: 551,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="product_section overflow-hidden sec_ptb_140 clearfix">
      <div className="container">
        <div className="sports_section_title text-center mb_50">
          <span className="sub_title mb-0">
            Hugo &amp; Marie is an independent
          </span>
          <h2 className="title_text text-uppercase mb-0">buy sports Dress</h2>
          <strong
            className="big_title text-uppercase"
            data-text-color="rgba(0, 0, 0, 0.05)"
          >
            Sport
          </strong>
        </div>
        <div className="sports_product_tab position-relative">
          <ul
            className="sports_absolute_tabnav nav ul_li_block text-uppercase"
            role="tablist"
          >
            {products?.map((cat, index) => (
              <li key={index}>
                <a
                  className={`nav-link ${index === 0 ? "active" : ""}`}
                  data-toggle="tab"
                  href={`#phantom_tab${index}`}
                >
                  {cat.category.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="tab-content mb_50">
            {products?.map((cat, index) => (
              <div
                key={index}
                id={`phantom_tab${index}`}
                className={`tab-pane ${index === 0 ? "active" : ""}`}
              >
                <div
                  id={`products-carousel-home${index + 1}`}
                  className="row justify-content-center"
                >
                  <Slider className="col-12" {...settings3}>
                    {cat?.products?.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="py-2 px-md-3 px-2"
                        id={`${cat.category}${item._id}`}
                      >
                        <ProductCard id={item._id} product={item} />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureProductsTabs;
