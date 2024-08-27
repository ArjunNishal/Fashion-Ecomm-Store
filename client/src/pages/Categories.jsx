import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import useScrollTo from "../components/useScrollTo";
import NewsLetter from "../components/NewsLetter";
import { axiosInstance, renderUrl } from "../config";

const Categories = () => {
  const selector = "categories-section";
  useScrollTo(selector);
  const [categories, setcategories] = useState([]);

  const breadlinks = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/categories",
      text: "Categories",
    },
  ];

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`client/cat/get/allcategories`);
      console.log(response.data.data);
      setcategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <Header />
      {/* <ScrollToTop /> */}
      <main>
        <Breadcrumb
          pagename={"Categories"}
          breadcrumbitems={breadlinks}
          backgroundimg={"assets/images/breadcrumb/bg_14.jpg"}
        />
        {/* product_section - start
			================================================== */}
        <section
          id="categories-section"
          className="category_section sec_ptb_100  clearfix"
        >
          <div className="container">
            <div className="row mt__50 justify-content-center mx-0">
              <div className="col-lg-3 col-md-4 col-4">
                <div className="fashion_category_circle">
                  {/* <div className="item_offer bg_fashion_red text-white">
                    <span>50%</span>
                    <span>FLAT</span>
                  </div> */}
                  <div className="item_image">
                    <img
                      src={`assets/images/category/fashion/img_03.jpg`}
                      alt="category"
                      onError={(e) => {
                        e.target.src =
                          "assets/images/category/fashion/img_03.jpg";
                      }}
                    />
                    <Link
                      className="icon_btn bg_fashion_red"
                      to={`/productslist/all`}
                    >
                      <i className="fal fa-arrow-right" />
                    </Link>
                  </div>
                  <div className="item_content text-uppercase">
                    <h3 className="item_title">All Categories</h3>
                    {/* <span className="item_instock">5 ITEMS</span> */}
                  </div>
                </div>
              </div>
              {categories.map((el, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-4">
                  <div className="fashion_category_circle">
                    {el.offer && (
                      <div className="item_offer bg_fashion_red text-white">
                        <span>{el.offer}</span>
                        <span>FLAT</span>
                      </div>
                    )}
                    <div className="item_image">
                      <img
                        src={`${renderUrl}uploads/category/${el.image}`}
                        alt="category"
                        onError={(e) => {
                          e.target.src =
                            "assets/images/category/fashion/img_03.jpg";
                        }}
                      />
                      <Link
                        className="icon_btn bg_fashion_red"
                        to={`/productslist/${el._id}`}
                      >
                        <i className="fal fa-arrow-right" />
                      </Link>
                    </div>
                    <div className="item_content text-uppercase">
                      <h3 className="item_title">{el.name}</h3>
                      {/* <span className="item_instock">5 ITEMS</span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <NewsLetter />

        {/* product_section - end
			================================================== */}
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
