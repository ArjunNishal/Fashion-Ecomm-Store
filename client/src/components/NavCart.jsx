import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { renderUrl } from "../config";
import { removeFromCartAPI } from "../Redux/reducers/cartSlice";

const NavCart = () => {
  const cartData = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();

  const handleRemoveCart = (item) => {
    dispatch(removeFromCartAPI(item));
  };

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

  return (
    <>
      <ul className="cart_items_list ul_li_block mb_30 clearfix">
        {cartData.items.map((item, index) => {
          // console.log(item, "item-----------");
          return (
            <li className="nav_cart_item" key={index}>
              <div className="item_image">
                <img
                  src={`${renderUrl}uploads/product/${item.product.thumbnail}`}
                  alt="image_not_found"
                />
              </div>
              <div className="item_content">
                <h4 className="item_title">
                  {" "}
                  <Link
                    className="text-dark"
                    to={`/product/${item.product._id}`}
                  >
                    {item.product.productName}
                  </Link>
                </h4>
                <span className="item_price">&#8377;{item.product.price}</span>
                <div className="item_title">
                  <small>Quantity : {item.quantity}</small>
                </div>
              </div>
              <button
                onClick={() => {
                  handleRemoveCart(item);
                }}
                type="button"
                className="remove_btn"
              >
                <i className="fal fa-trash-alt" />
              </button>
            </li>
          );
        })}
        {cartData.items.length === 0 || !cartData.items ? (
          <>
            <div className="text-center">
              <p>
                <i class="far fa-shopping-cart text-danger"></i>
              </p>
              <p>No Items in Cart</p>
            </div>
          </>
        ) : (
          ""
        )}
      </ul>
      <ul className="total_price ul_li_block mb_30 clearfix">
        <li>
          <span>Subtotal:</span>
          <span>&#8377;{Subtotal}</span>
        </li>

        <li>
          <span>Discount {Discountpercentage}%:</span>
          <span>- &#8377;{DiscountAmt}</span>
        </li>
        <li>
          <span>Total:</span>
          <span>&#8377;{Grandtotal}</span>
        </li>
      </ul>
      <ul className="btns_group ul_li_block clearfix">
        {cartData.items.length > 0 ? (
          <>
            {" "}
            <li>
              <Link to="/cart">View Cart</Link>
            </li>{" "}
          </>
        ) : (
          ""
        )}
        {cartData.items.length > 0 ? (
          <>
            {" "}
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>{" "}
          </>
        ) : (
          ""
        )}
      </ul>
    </>
  );
};

export default NavCart;
