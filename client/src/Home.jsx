import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Banner2 from "./components/Home/Banner2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NewsLetter from "./components/NewsLetter";
import ProductCard from "./components/ProductCard";
import useScrollTo from "./components/useScrollTo";
import FeatureProductsTabs from "./components/Home/FeatureProductsTabs";
import { axiosInstance } from "./config";
import FeatureOffers from "./components/Home/FeatureOffers";
import FeatureCategorySection from "./components/Home/FeatureCategorySection";

const Home = () => {
  useScrollTo();

  const [products, setProducts] = useState([]);
  const [Offers, setOffers] = useState([]);

  const [featureproductlist, setfeatureproductlist] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `client/product/featured-products/home`
      );
      console.log(response.data);
      setProducts(response.data.data);
      setfeatureproductlist(response.data.featureproductlist);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axiosInstance.get(`client/offer/get/offers`);
      console.log(response.data, "oFfers");
      setOffers(response.data.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOffers();
  }, []);

  return (
    <>
      <Header />
      {/* <ScrollToTop /> */}

      <main>
        {/* slider_section - start
			================================================== */}
        <section className=" sports_slider position-relative  clearfix">
          <div
            id="homebannerslider"
            className=" carousel slide carousel-fade"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">
              {Offers.map((el, index) => {
                return (
                  <li
                    key={index}
                    data-target="#homebannerslider"
                    data-slide-to={index}
                    className={`${index === 0 ? "active" : ""}`}
                  ></li>
                );
              })}
            </ol>
            <div className="carousel-inner">
              {Offers.map((of, index) => {
                const heading = of?.name;
                const headingWords = heading.split(" ");
                const lastWord = headingWords.pop();
                const firstPart = headingWords.join(" ");
                // alert(lastWord);
                return (
                  <div
                    key={index}
                    className={`carousel-item  d-flex align-items-center ${
                      index === 0 ? "active" : ""
                    }`}
                    data-bg-color="#ebebeb"
                  >
                    <div className="container">
                      <div className="item_content">
                        <h3
                          className="item_title text-uppercase"
                          data-animation="fadeInUp"
                          data-delay=".2s"
                        >
                          {firstPart}
                          <span
                            style={{ color: "#ff3f3f" }}
                            data-text-color="#ff3f3f"
                          >
                            {lastWord}
                          </span>
                        </h3>
                        <p data-animation="fadeInUp" data-delay=".4s">
                          {of.description}
                        </p>
                        <a
                          className="text_btn text-uppercase"
                          href="#!"
                          data-animation="fadeInUp"
                          data-delay=".6s"
                        >
                          <span>Explore Now</span>
                        </a>
                      </div>
                    </div>
                    <div className="item_image_1">
                      <img
                        src="/assets/images/slider/sports/img_01.png"
                        data-animation="fadeInRight"
                        data-delay=".4s"
                        alt="image_not_found"
                      />
                      <div
                        className="small_image_1"
                        data-background="assets/images/slider/sports/shape_01.png"
                        data-animation="fadeInUp"
                        data-delay=".6s"
                      >
                        <img
                          src="/assets/images/slider/sports/img_03.png"
                          alt="image_not_found"
                        />
                      </div>
                    </div>
                    <div
                      className="item_image_2"
                      data-animation="fadeInLeft"
                      data-delay=".5s"
                    >
                      <img
                        src="/assets/images/slider/sports/img_02.png"
                        alt="image_not_found"
                      />
                    </div>
                  </div>
                );
              })}

              {/* <div
                className="carousel-item d-flex align-items-center"
                data-bg-color="#ebebeb"
              >
                <div className="container">
                  <div className="item_content">
                    <h3
                      className="item_title text-uppercase"
                      data-animation="fadeInUp"
                      data-delay=".2s"
                    >
                      2 Hoodie sweat<span data-text-color="#ff3f3f">shirt</span>
                    </h3>
                    <p data-animation="fadeInUp" data-delay=".4s">
                      Hugo &amp; Marie is an independent artist management firm
                      and creative agency based in New York City. Founded in
                      2008, the company has been built around a visual
                    </p>
                    <a
                      className="text_btn text-uppercase"
                      href="#!"
                      data-animation="fadeInUp"
                      data-delay=".6s"
                    >
                      <span>Explore Now</span>
                    </a>
                  </div>
                </div>
                <div className="item_image_1">
                  <img
                    src="/assets/images/slider/sports/img_01.png"
                    data-animation="fadeInRight"
                    data-delay=".4s"
                    alt="image_not_found"
                  />
                  <div
                    className="small_image_1"
                    data-background="assets/images/slider/sports/shape_01.png"
                    data-animation="fadeInUp"
                    data-delay=".6s"
                  >
                    <img
                      src="/assets/images/slider/sports/img_03.png"
                      alt="image_not_found"
                    />
                  </div>
                </div>
                <div
                  className="item_image_2"
                  data-animation="fadeInLeft"
                  data-delay=".5s"
                >
                  <img
                    src="/assets/images/slider/sports/img_02.png"
                    alt="image_not_found"
                  />
                </div>
              </div>
              <div
                className="carousel-item d-flex align-items-center"
                data-bg-color="#ebebeb"
              >
                <div className="container">
                  <div className="item_content">
                    <h3
                      className="item_title text-uppercase"
                      data-animation="fadeInUp"
                      data-delay=".2s"
                    >
                      3 Hoodie sweat<span data-text-color="#ff3f3f">shirt</span>
                    </h3>
                    <p data-animation="fadeInUp" data-delay=".4s">
                      Hugo &amp; Marie is an independent artist management firm
                      and creative agency based in New York City. Founded in
                      2008, the company has been built around a visual
                    </p>
                    <a
                      className="text_btn text-uppercase"
                      href="#!"
                      data-animation="fadeInUp"
                      data-delay=".6s"
                    >
                      <span>Explore Now</span>
                    </a>
                  </div>
                </div>
                <div className="item_image_1">
                  <img
                    src="/assets/images/slider/sports/img_01.png"
                    data-animation="fadeInRight"
                    data-delay=".4s"
                    alt="image_not_found"
                  />
                  <div
                    className="small_image_1"
                    data-background="assets/images/slider/sports/shape_01.png"
                    data-animation="fadeInUp"
                    data-delay=".6s"
                  >
                    <img
                      src="/assets/images/slider/sports/img_03.png"
                      alt="image_not_found"
                    />
                  </div>
                </div>
                <div
                  className="item_image_2"
                  data-animation="fadeInLeft"
                  data-delay=".5s"
                >
                  <img
                    src="/assets/images/slider/sports/img_02.png"
                    alt="image_not_found"
                  />
                </div>
              </div> */}
            </div>
            <div>
              {/* <a
                  className="carousel-control-prev"
                  href="#carouselExampleFade"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Previous</span>
                </a>
                <a
                  className="carousel-control-next"
                  href="#carouselExampleFade"
                  role="button"
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Next</span>
                </a> */}
            </div>
          </div>
          <div className="carousel_nav">
            <button
              type="button"
              data-slide="prev"
              data-target="#homebannerslider"
              className="main_left_arrow text-uppercase"
            >
              Prev
            </button>
            <button
              data-slide="next"
              data-target="#homebannerslider"
              type="button"
              className="main_right_arrow text-uppercase"
            >
              Next
            </button>
          </div>
          {/* <div className="slide_count_wrap text-white">
            <span className="current">1</span>
            <span className="total">3</span>
          </div> */}
        </section>

        {/* slider_section - end
			================================================== */}
        {/* sports_about_section - start
			================================================== */}
        <section className="sports_about_section sec_ptb_140 clearfix">
          <div className="container">
            <div className="row align-items-center justify-content-lg-between justify-content-md-between justify-content-sm-center">
              <div className="col-lg-6 col-md-6 col-sm-8 col-xs-12">
                <div className="about_image">
                  <img
                    src="/assets/images/about/sports/img_01.png"
                    alt="image_not_found"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-8 col-xs-12">
                <div className="about_content mb_30">
                  <h2 className="title_text text-uppercase mb_15">
                    AW 18 Collection
                  </h2>
                  <p>
                    Hugo &amp; Marie is an independent artist management firm
                    and creative agency based in New York City. Founded in 2008,
                    the company has been built around a visual
                  </p>
                  <a className="custom_btn bg_black text-uppercase" href="#!">
                    View Product
                  </a>
                </div>
                <div className="about_image">
                  <img
                    src="/assets/images/about/sports/img_02.png"
                    alt="image_not_found"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* sports_about_section - end
			================================================== */}
        {/* sports_feature_section - start
			================================================== */}
        <Banner2 products={featureproductlist} />
        {/* sports_feature_section - end
			================================================== */}
        {/* product_section - start
			================================================== */}
        <FeatureProductsTabs products={products} />
        {/* product_section - end
			================================================== */}
        {/* sports_big_feature - start
			================================================== */}
        <section
          className="sports_big_feature sec_ptb_100 deco_wrap clearfix"
          data-bg-color="#1f1f27"
        >
          <div className="container-fluid prl_100">
            <div className="row align-items-center justify-content-lg-between justify-content-md-center justify-content-sm-center">
              <div className="col-lg-7 col-md-8 col-sm-10 col-xs-12">
                <div className="item_image">
                  <img
                    src="/assets/images/feature/sports/img_04.jpg"
                    alt="image_not_found"
                  />
                </div>
              </div>
              <div className="col-lg-5 col-md-8 col-sm-10 col-xs-12">
                <div className="item_content text-white">
                  {/* <span className="item_price">$195</span> */}
                  {(() => {
                    const offer = Offers[0];
                    const heading = offer?.name || ""; // Handle cases where offer or name might be undefined
                    const headingWords = heading.split(" ");
                    const lastWord = headingWords.pop();
                    const firstPart = headingWords.join(" ");
                    return (
                      <h2 className="item_title text-uppercase text-white mb_15">
                        {firstPart}{" "}
                        <span
                          style={{ color: "#ff3f3f" }}
                          data-text-color="#ff3f3f"
                        >
                          {lastWord}
                        </span>
                      </h2>
                    );
                  })()}
                  <p className="mb_30">{Offers[0]?.description}</p>
                  <a className="text_btn text-uppercase" href="#!">
                    <span>Shop Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="deco_image shape_1">
            <img
              src="/assets/images/feature/sports/shape_01.png"
              alt="image_not_found"
            />
          </div>
          <div className="deco_image shape_2">
            <img
              src="/assets/images/feature/sports/shape_02.png"
              alt="image_not_found"
            />
          </div>
        </section>
        {/* sports_big_feature - end
			================================================== */}
        {/* feature_section - start
			================================================== */}
        <FeatureCategorySection products={products} />
        {/* feature_section - end
			================================================== */}
        {/* blog_section - start
			================================================== */}
        <section className="blog_section clearfix">
          <div className="container">
            <div className="sports_section_title text-center mb_100">
              <span className="sub_title mb-0">
                Hugo &amp; Marie is an independent
              </span>
              <h2 className="title_text text-uppercase mb-0">Latest Newses</h2>
              <strong
                className="big_title text-uppercase"
                data-text-color="rgba(0, 0, 0, 0.05)"
              >
                Sport
              </strong>
            </div>
          </div>
          <div className="blog_items_wrap clearfix">
            <div
              className="sports_blog_item text-white"
              data-bg-color="#1f1f27"
            >
              <div className="item_image">
                <img
                  src="/assets/images/blog/sports/img_01.jpg"
                  alt="image_not_found"
                />
              </div>
              <div className="item_content d-flex align-items-center justify-content-center">
                <div className="content_wrap">
                  <h3 className="item_title text-uppercase text-white mb_15">
                    Sports sweat <span data-text-color="#ff3f3f">Shoes</span>
                  </h3>
                  <ul className="post_meta ul_li mb_15 clearfix">
                    <li>
                      <i className="far fa-calendar-alt mr-1" /> Dec 21, 2018
                    </li>
                    <li>
                      <i className="fas fa-user mr-1" /> By Pander
                    </li>
                  </ul>
                  <p>
                    Hugo &amp; Marie is an independent artist management firm
                    and Creative agency based in New York City. Founded in 2008,
                    the company has been built around a visual
                  </p>
                  <a
                    className="custom_btn bg_sports_red text-uppercase"
                    href="#!"
                  >
                    View Product
                  </a>
                </div>
              </div>
            </div>
            <div
              className="sports_blog_item text-white"
              data-bg-color="#1f1f27"
            >
              <div className="item_image">
                <img
                  src="/assets/images/blog/sports/img_02.jpg"
                  alt="image_not_found"
                />
              </div>
              <div className="item_content d-flex align-items-center justify-content-center">
                <div className="content_wrap">
                  <h3 className="item_title text-uppercase text-white mb_15">
                    Sports sweat <span data-text-color="#ff3f3f">Shoes</span>
                  </h3>
                  <ul className="post_meta ul_li mb_15 clearfix">
                    <li>
                      <i className="far fa-calendar-alt mr-1" /> Dec 21, 2018
                    </li>
                    <li>
                      <i className="fas fa-user mr-1" /> By Pander
                    </li>
                  </ul>
                  <p>
                    Hugo &amp; Marie is an independent artist management firm
                    and Creative agency based in New York City. Founded in 2008,
                    the company has been built around a visual
                  </p>
                  <a
                    className="custom_btn bg_sports_red text-uppercase"
                    href="#!"
                  >
                    View Product
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* blog_section - end
			================================================== */}
        {/* feature_product_section - start
			================================================== */}

        <FeatureOffers products={products} />

        {/* feature_product_section - end
			================================================== */}

        {/* newsletter area - start
			================================================== */}
        <NewsLetter />
        {/* newsletter area - end
			================================================== */}
        {/* brand_section - start
			================================================== */}
        <div className="brand_section sec_ptb_100 clearfix">
          <div className="container-fluid prl_100">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row justify-content-center">
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_31.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_32.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_33.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_34.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_35.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_36.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_32.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_34.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_31.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_36.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_35.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 col-6">
                    <a className="brand_item" href="#!">
                      <img
                        src="/assets/images/brands/img_33.png"
                        alt="image_not_found"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* brand_section - end
			================================================== */}
      </main>

      <Footer />
    </>
  );
};

export default Home;
