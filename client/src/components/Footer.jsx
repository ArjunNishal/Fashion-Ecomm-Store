import React from "react";
import { scrollToTop } from "./int";
import ScrollToTopButton from "./ScrollToTopButton";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer
        className="footer_section fashion_minimal_footer clearfix"
        data-bg-color="#222222"
      >
        {/* <div className="backtotop " data-background="assets/images/shape_01.png">
        <a href="#" onClick={scrollToTop} className="scroll">
          <i className="far fa-arrow-up" />
        </a>
      </div> */}

        <div className="footer_widget_area sec_ptb_100 clearfix">
          <div className="container">
            <div className="row justify-content-lg-between">
              <div className="col-lg-4 col-lmd-6 col-sm-6 col-xs-12">
                <div className="footer_widget footer_about">
                  <div className="brand_logo mb_30">
                    <a href="#!">
                      <img
                        src="/assets/images/logo/logo_33_1x.png"
                        srcSet="/assets/images/logo/logo_33_2x.png 2x"
                        alt="logo_not_found"
                      />
                    </a>
                  </div>
                  {/* <p className="mb_30">
                    Etiam rhoncus sit amet adip scing sed ipsum. Lorem ipsum
                    dolor sit amet adipiscing sem neque. dolor sit amet
                    adipiscing sem neque.
                  </p> */}

                  <ul className="circle_social_links ul_li clearfix">
                    <li>
                      <a href="#!">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="#!">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#!">
                        <i className="fab fa-youtube" />
                      </a>
                    </li>
                    <li>
                      <a href="#!">
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                  </ul>
                  <div className="mb_30">
                    <Link
                      class="custom_btn bg_sports_red text-uppercase"
                      to="/reqaquery"
                    >
                      Have any Query?
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-lmd-6 col-sm-6 col-xs-12">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-lmd-6 col-sm-6 col-xs-12">
                    <div className="footer_widget footer_useful_links clearfix">
                      <h3 className="footer_widget_title text-white">Links</h3>
                      <ul className="ul_li_block">
                        <li>
                          <Link to="/categories">Categories</Link>
                        </li>{" "}
                        <li>
                          <Link to="/aboutus">About</Link>
                        </li>
                        <li>
                          <Link to="/contactus">Contact</Link>
                        </li>
                        <li>
                          <Link to="/termsandconditions">
                            Terms & Conditions
                          </Link>
                        </li>
                        <li>
                          <Link to="/privacypolicy">Privacy Policy</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-lmd-6 col-sm-6 col-xs-12">
                    <div className="footer_widget footer_useful_links clearfix">
                      <h3 className="footer_widget_title text-white">Links</h3>
                      <ul className="ul_li_block">
                        <li>
                          <a href="#!">Table/Floor Toys</a>
                        </li>
                        <li>
                          <a href="#!">Outdoor Games</a>
                        </li>
                        <li>
                          <a href="#!">Sand Play</a>
                        </li>
                        <li>
                          <a href="#!">Play Dough</a>
                        </li>
                        <li>
                          <a href="#!">Building Blocks</a>
                        </li>
                        <li>
                          <a href="#!">Water Play</a>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="col-lg-4 col-lmd-6 col-sm-6 col-xs-12">
                <div className="footer_widget sports_footer_contact clearfix">
                  <h3 className="footer_widget_title text-white">
                    Get In Touch
                  </h3>
                  <ul className="ul_li_block">
                    <li>
                      <span className="icon">
                        <i className="fal fa-phone-square" />
                      </span>
                      <div className="content_wrap d-table">
                        <p className="mb-0">Open: 8:00 AM - Close: 18:00 PM</p>
                        <p className="mb-0">Saturday - Sunday: Close</p>
                      </div>
                    </li>
                    <li>
                      <span className="icon">
                        <i className="fal fa-envelope" />
                      </span>
                      <div className="content_wrap d-table">
                        <p className="mb-0">(012) 800 456 789-987</p>
                        <p className="mb-0">jthemes@gmail.com</p>
                      </div>
                    </li>
                    <li>
                      <span className="icon">
                        <i className="fal fa-map" />
                      </span>
                      <div className="content_wrap d-table">
                        <p className="mb-0">
                          123 Main Street, Anytown, CA 12345 - USA. United
                          States
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer_bottom">
            <div className="row align-items-center justify-content-lg-between">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <p className="copyright_text mb-0">
                  © Copyrights, 2024{" "}
                  <a
                    href="https://intoggle.com/"
                    target="_blank"
                    className="author_link text-white"
                  >
                    Intoggle.com
                  </a>
                </p>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="payment_methods float-lg-right float-md-right">
                  <img
                    src="/assets/images/payment_methods_04.png"
                    alt="image_not_found"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ScrollToTopButton />
    </>
  );
};

export default Footer;
