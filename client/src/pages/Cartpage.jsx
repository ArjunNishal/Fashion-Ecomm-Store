import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";
import useScrollTo from "../components/useScrollTo";
import { useDispatch, useSelector } from "react-redux";
import { renderUrl } from "../config";
import {
  decreaseQuantityAPI,
  increaseQuantityAPI,
  removeFromCartAPI,
} from "../Redux/reducers/cartSlice";

const Cartpage = () => {
  useScrollTo();

  const cartData = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/cart",
      text: "Cart",
    },
  ];

  const [Subtotal, setSubtotal] = useState(0);
  const [Grandtotal, setGrandtotal] = useState(0);
  const [Discountpercentage, setDiscountpercentage] = useState(0);
  const [DiscountAmt, setDiscountAmt] = useState(0);

  const calculatecartValue = () => {
    let subtotalprice = 0;
    let grandprice = 0;
    let discountperc = 0;
    let discount = 0;

    cartData.items.forEach((item) => {
      const itemTotalPrice = item.product.actualPrice * item.quantity;
      const itemGrandPrice = item.product.price * item.quantity;
      const itemDiscountpercentage = item.product.discount * item.quantity;
      const itemDiscountAmt =
        (item.product.actualPrice - item.product.price) * item.quantity;

      subtotalprice += itemTotalPrice;
      grandprice += itemGrandPrice;
      discountperc += itemDiscountpercentage;
      discount += itemDiscountAmt;

      setSubtotal(subtotalprice);
      setGrandtotal(grandprice);
      setDiscountpercentage(discountperc);
      setDiscountAmt(discount);
    });
  };

  useEffect(() => {
    calculatecartValue();
  }, [cartItems]);

  const handleIncrement = (item) => {
    dispatch(increaseQuantityAPI(item));
  };

  const handleDecrement = (item) => {
    dispatch(decreaseQuantityAPI(item));
  };

  const handleRemoveCart = (item) => {
    dispatch(removeFromCartAPI(item));
  };

  return (
    <div>
      <Header />
      <main>
        {" "}
        <Breadcrumb
          pagename={"Cart"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        <section className="cart_section sec_ptb_140 clearfix">
          <div className="container">
            {cartItems.length > 0 && (
              <>
                <div className="cart_table mb_50 d-md-block d-none">
                  <table className="table">
                    <thead className="text-uppercase">
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData?.items?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="cart_product">
                                <div className="item_image">
                                  <img
                                    style={{
                                      height: "100px",
                                      objectFit: "contain",
                                      width: "100%",
                                    }}
                                    src={`${renderUrl}uploads/product/${item?.product?.thumbnail}`}
                                    alt="image_not_found"
                                  />
                                </div>
                                <div className="item_content">
                                  <h4 className="item_title">
                                    <Link
                                      className="text-dark"
                                      to={`/product/${item.product._id}`}
                                    >
                                      {item.product.productName}
                                    </Link>
                                  </h4>
                                  {/* <span className="item_type">Clothes</span> */}
                                </div>
                                <button
                                  onClick={() => {
                                    handleRemoveCart(item);
                                  }}
                                  type="button"
                                  className="remove_btn"
                                >
                                  <i className="fal fa-times" />
                                </button>
                              </div>
                            </td>
                            <td>
                              <span className="price_text">
                                &#8377;{item.product.price}
                              </span>
                            </td>
                            <td>
                              <div className="quantity_input">
                                <div>
                                  <span
                                    onClick={() => {
                                      handleDecrement(item);
                                    }}
                                    className="input_number_decrement"
                                  >
                                    –
                                  </span>
                                  <input
                                    className="input_number"
                                    type="text"
                                    // defaultValue={2}
                                    value={item.quantity}
                                  />
                                  <span
                                    onClick={() => {
                                      handleIncrement(item);
                                    }}
                                    className="input_number_increment"
                                  >
                                    +
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="total_price">
                                &#8377;{item.product.price * item.quantity}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* mobile table */}
                <div className="cart-table-mobile d-md-none d-block">
                  <div className="row mx-0">
                    <div className="col-12">
                      <h5 className="text-center mb-3">Your items</h5>
                    </div>
                    {cartData?.items?.map((item, index) => {
                      return (
                        <div key={index} className="col-12 px-0">
                          <div className="cart-table-item card shadow mb-2 p-2">
                            <div className="row mx-0 align-items-center">
                              <div className="col-4">
                                <img
                                  src={`${renderUrl}uploads/product/${item?.product?.thumbnail}`}
                                  className=""
                                  alt="img"
                                />
                              </div>
                              <div className="col-8">
                                <h6 className="item_title">
                                  <Link
                                    className="text-dark"
                                    to={`/product/${item.product._id}`}
                                  >
                                    {item.product.productName}
                                  </Link>
                                </h6>
                                <div>
                                  <span className="price_text">
                                    {" "}
                                    &#8377;{item.product.price}
                                  </span>
                                </div>
                                <div className="my-2">
                                  <p className="m-0 ">
                                    Total :{" "}
                                    <b className="text-success">
                                      {" "}
                                      &#8377;
                                      {item.product.price * item.quantity}
                                    </b>
                                  </p>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="quantity_input">
                                    <div>
                                      <span
                                        onClick={() => {
                                          handleDecrement(item);
                                        }}
                                        className="input_number_decrement"
                                      >
                                        –
                                      </span>
                                      <input
                                        className="input_number"
                                        type="text"
                                        value={item.quantity}
                                      />
                                      <span
                                        onClick={() => {
                                          handleIncrement(item);
                                        }}
                                        className="input_number_increment"
                                      >
                                        +
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      handleRemoveCart(item);
                                    }}
                                    className="btn text-danger shadow-none"
                                  >
                                    <i className="far fa-trash-alt"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                          <span>Subtotal</span> <span>&#8377;{Subtotal}</span>
                        </li>
                        <li>
                          <span>Discount {Discountpercentage}%</span>{" "}
                          <span className="text-danger">
                            - &#8377;{DiscountAmt}
                          </span>
                        </li>
                        <li>
                          <span>Total</span> <span>&#8377;{Grandtotal}</span>
                        </li>
                      </ul>
                      <Link to="/checkout" className="custom_btn bg_success">
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
            {cartItems.length === 0 && (
              <>
                <div className="text-center">
                  <p>
                    <i class="far fa-shopping-cart text-danger"></i>
                  </p>
                  <p>No Items in Cart</p>
                  <div className="py-3">
                    <Link
                      to="/"
                      className="custom_btn bg_danger text-uppercase"
                    >
                      Shop now
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cartpage;
