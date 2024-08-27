import React, { useState, useRef, useEffect } from "react";
import { renderUrl } from "../../config";
import ImageSlide from "./ImageSlide";

const ImageSlider = ({ images }) => {
  const [activeTab, setActiveTab] = useState(
    images?.length > 0 ? images[0] : ""
  );

  const [selectedslideindex, setselectedslideindex] = useState(0);

  useEffect(() => {
    console.log(images, "images");
    if (images[0]) {
      setActiveTab(images[0]);
    }
  }, [images]);

  const handlemobsliderchange = (ind) => {
    setselectedslideindex(ind);
  };

  return (
    <>
      <div className="details_image_tab">
        <div className="tab-content mb_30">
          {images?.map((image, index) => {
            const imageurl = `${renderUrl}uploads/product/${image}`;

            return (
              <div
                key={index}
                id={image}
                className={`tab-pane ${
                  activeTab === image ? "active" : "fade"
                }`}
              >
                <ImageSlide
                  imageurl={imageurl}
                  index={index}
                  handlemobsliderchange={handlemobsliderchange}
                />
              </div>
            );
          })}
        </div>
        <ul
          className="details_image_nav flex-nowrap nav ul_li_center"
          role="tablist"
        >
          {images?.map((image, index) => {
            const imageurl = `${renderUrl}uploads/product/${image}`;
            return (
              <li key={index}>
                <a
                  className={activeTab === image ? "active" : ""}
                  onClick={() => setActiveTab(image)}
                  data-toggle="tab"
                  href={`#${image}`}
                >
                  <img src={imageurl} alt="image_not_found" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        {/* Button trigger modal */}

        {/* Modal */}
        <div
          className="modal p-0 m-0 fade"
          id="productimages"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog m-0">
            <div className="modal-content">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <div className="modal-body p-0">
                <div className="product-img-slider">
                  <div
                    id="productimg-carousel"
                    className="carousel slide"
                    data-ride="carousel"
                  >
                    <div className="product-carousel-indicators">
                      {/* <div className="product-indicators-box"> */}
                      {images?.map((el, index) => (
                        <div
                          key={index}
                          onClick={() => handlemobsliderchange(index)}
                          data-target="#productimg-carousel"
                          data-slide-to={index}
                          className={`indicator-item ${
                            index === selectedslideindex ? "active" : ""
                          }`}
                        >
                          <img src={`${el.src}`} alt="" />
                        </div>
                      ))}
                      {/* </div> */}
                    </div>
                    <div className="carousel-inner ">
                      {images?.map((el, index) => {
                        return (
                          <div
                            key={index}
                            className={`carousel-item ${
                              index === selectedslideindex ? "active" : ""
                            }`}
                          >
                            <div className="product-carousel-img">
                              <img src={`${el.src}`} alt="product" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <a
                      className="carousel-control-prev"
                      href="#productimg-carousel"
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
                      href="#productimg-carousel"
                      role="button"
                      data-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Next</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
