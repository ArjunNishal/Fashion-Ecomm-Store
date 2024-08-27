import React from "react";
import { Link } from "react-router-dom";
import { renderUrl } from "../config";

const ProductCard = ({ id, product, backurl }) => {
  return (
    // <div className="sports_product_item">
    //   <div className="item_image" data-bg-color="#f5f5f5">
    //     <img src="/assets/images/shop/sports/img_03.png" alt="image_not_found" />
    //     <ul className="product_action_btns ul_li_center clearfix">
    //       <li>
    //         <Link to="/product?pid=0">
    //           <i className="fas fa-shopping-cart" />
    //         </Link>
    //       </li>
    //     </ul>
    //     <ul className="product_label ul_li text-uppercase clearfix">
    //       <li className="bg_sports_red">50% Off</li>
    //       <li className="bg_sports_red">Sale</li>
    //     </ul>
    //   </div>
    //   <div className="item_content text-uppercase text-white">
    //     <h3 className="item_title bg_black text-white mb-0">
    //       PHANTOM VISION ACADEMY
    //     </h3>
    //     <span className="item_price bg_sports_red">
    //       <strong>₹195</strong> <del>₹390</del>
    //     </span>
    //   </div>
    // </div>
    <div className="card product-card border-0 shadow">
      <div className="card-body position-relative">
        {product?.discount > 0 && (
          <div className="offer-sticky">
            <p className="m-0">
              {product?.discount > 0 ? product?.discount : ""}% off
            </p>
          </div>
        )}
        <button className="wishlist-sticky">
          <i className="far fa-heart"></i>
        </button>
        <div className="product-card-img-wrapper">
          <div
            id={`product-card-images-card${id}`}
            className="carousel slide"
            data-ride="carousel"
            data-pause="false"
          >
            <ol className="carousel-indicators">
              {" "}
              <li
                data-target={`#product-card-images-card${id}`}
                data-slide-to={0}
                className={"active"}
              />
              {product?.images?.map((img, index) => (
                <li
                  key={index}
                  data-target={`#product-card-images-card${id}`}
                  data-slide-to={index + 1}
                />
              ))}
            </ol>
            <div className="carousel-inner">
              <div className={`carousel-item  active`}>
                <Link
                  to={`/product/${product?._id}${
                    backurl !== "" ? `?cid=${backurl}` : ""
                  }`}
                  className="product-carosuel-img"
                >
                  <img
                    // src="/assets/images/shop/sports/img_03.png"
                    src={`${renderUrl}uploads/product/${product?.thumbnail}`}
                    className="d-block "
                    alt="productimg"
                  />
                </Link>
              </div>
              {product?.images?.map((img, index) => (
                <div key={index} className={`carousel-item`}>
                  <Link
                    to={`/product/${product?._id}${
                      backurl !== "" ? `?cid=${backurl}` : ""
                    }`}
                    className="product-carosuel-img"
                  >
                    <img
                      // src="/assets/images/shop/sports/img_03.png"
                      src={`${renderUrl}uploads/product/${img}`}
                      className="d-block "
                      alt="productimg"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link
          to={`/product/${product?._id}${
            backurl !== "" ? `?cid=${backurl}` : ""
          }`}
          className="product-card-details w-100"
        >
          <p className="product-card-name">{product?.productName}</p>
          <div className="product-price-container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="price-box">
                <span className="discounted-price">₹{product?.price}</span>
                <span className="actual-price">
                  <small>
                    <strike>₹{product?.actualPrice}</strike>
                  </small>
                </span>
                <div className="product-card-rating">
                  <div className="d-flex">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <>
                        {index + 1 < product?.totalRating ? (
                          <i key={index} className="fas fa-star" />
                        ) : index + 1 > product?.totalRating &&
                          product?.totalRating > index ? (
                          <i key={index} class="fas fa-star-half-alt"></i>
                        ) : (
                          <i key={index} className="far fa-star" />
                        )}
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className="product-card-addtobag">
                <button className="addtobag-icon">
                  <i className="fal fa-shopping-bag"></i>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
