import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import useScrollTo from "../../components/useScrollTo";
import { useSelector } from "react-redux";

const Checkout = () => {
  const cartData = useSelector((state) => state.cart);
  const navigate = useNavigate("");

  useEffect(() => {
    if (cartData.items.length === 0) {
      navigate(-1);
    }
  }, []);

  useScrollTo();
  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/checkout",
      text: "Checkout",
    },
  ];
  return (
    <div>
      <Header />
      <main>
        {" "}
        <Breadcrumb
          pagename={"Checkout"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        <section className="cart_section sec_ptb_140 clearfix">
          <div className="container">
            <ul className="checkout_step ul_li clearfix">
              <li className="active">
                <Link to="/checkout">
                  <span>01.</span> Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout-two">
                  <span>02.</span> Checkout
                </Link>
              </li>
              <li>
                <Link to="/checkout-three">
                  <span>03.</span> Order Completed
                </Link>
              </li>
            </ul>
            <div className="cart_table mb_50">
              <table className="table">
                <thead className="text-uppercase bg-white border-bottom">
                  <tr>
                    <th>Photo</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="cart_product">
                        <div className="item_image">
                          <img
                            src="/assets/images/cart/img_04.jpg"
                            alt="image_not_found"
                          />
                        </div>
                        <div className="item_content">
                          <h4 className="item_title">Men's Polo T-shirt</h4>
                          <span className="item_type">Clothes</span>
                        </div>
                        <button type="button" className="remove_btn">
                          <i className="fal fa-times" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="price_text">$69.00</span>
                    </td>
                    <td>
                      <div className="quantity_input">
                        <form action="#">
                          <span className="input_number_decrement">–</span>
                          <input
                            className="input_number"
                            type="text"
                            defaultValue={2}
                          />
                          <span className="input_number_increment">+</span>
                        </form>
                      </div>
                    </td>
                    <td>
                      <span className="total_price">$138.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="cart_product">
                        <div className="item_image">
                          <img
                            src="/assets/images/cart/img_05.jpg"
                            alt="image_not_found"
                          />
                        </div>
                        <div className="item_content">
                          <h4 className="item_title">Men's Polo T-shirt</h4>
                          <span className="item_type">Clothes</span>
                        </div>
                        <button type="button" className="remove_btn">
                          <i className="fal fa-times" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="price_text">$23.00</span>
                    </td>
                    <td>
                      <div className="quantity_input">
                        <form action="#">
                          <span className="input_number_decrement">–</span>
                          <input
                            className="input_number"
                            type="text"
                            defaultValue={1}
                          />
                          <span className="input_number_increment">+</span>
                        </form>
                      </div>
                    </td>
                    <td>
                      <span className="total_price">$23.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="cart_product">
                        <div className="item_image">
                          <img
                            src="/assets/images/cart/img_06.jpg"
                            alt="image_not_found"
                          />
                        </div>
                        <div className="item_content">
                          <h4 className="item_title">Men's Polo T-shirt</h4>
                          <span className="item_type">Clothes</span>
                        </div>
                        <button type="button" className="remove_btn">
                          <i className="fal fa-times" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="price_text">$36.00</span>
                    </td>
                    <td>
                      <div className="quantity_input">
                        <form action="#">
                          <span className="input_number_decrement">–</span>
                          <input
                            className="input_number"
                            type="text"
                            defaultValue={1}
                          />
                          <span className="input_number_increment">+</span>
                        </form>
                      </div>
                    </td>
                    <td>
                      <span className="total_price">$36.00</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="coupon_wrap mb_50">
              <div className="row justify-content-lg-between">
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                  <div className="coupon_form">
                    <div className="form_item mb-0">
                      <input
                        type="text"
                        className="coupon"
                        placeholder="Coupon Code"
                      />
                    </div>
                    <button
                      type="submit"
                      className="custom_btn bg_danger text-uppercase"
                    >
                      Apply Coupon
                    </button>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
                  <div className="cart_update_btn">
                    <button
                      type="button"
                      className="custom_btn bg_secondary text-uppercase"
                    >
                      Update Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-lg-end">
              <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                <div
                  className="cart_pricing_table pt-0 text-uppercase"
                  data-bg-color="#f2f3f5"
                >
                  <h3
                    className="table_title text-center"
                    data-bg-color="#ededed"
                  >
                    Cart Total
                  </h3>
                  <ul className="ul_li_block clearfix">
                    <li>
                      <span>Subtotal</span> <span>$197.99</span>
                    </li>
                    <li>
                      <span>Shipping</span>{" "}
                      <span>
                        <a
                          className="shipping_calculate text-capitalize"
                          href="#!"
                        >
                          Calculate shipping
                        </a>
                      </span>
                    </li>
                    <li>
                      <span>Total</span> <span>$197.99</span>
                    </li>
                  </ul>
                  <a
                    href="shop_checkout_step2.html"
                    className="custom_btn bg_success"
                  >
                    Proceed to Checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
