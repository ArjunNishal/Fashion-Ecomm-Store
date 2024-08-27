import React, { useEffect, useState } from "react";
import { renderUrl } from "../../config";
import { Link } from "react-router-dom";

const FeatureCategorySection = ({ products }) => {
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    const getImageDimensions = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.src = url;
      });
    };

    const fetchAndSortCategories = async () => {
      const categoryImages = await Promise.all(
        products.map(async (product) => {
          const imgUrl = `${renderUrl}uploads/category/${product.category.image}`;
          const dimensions = await getImageDimensions(imgUrl);
          console.log(`Image URL: ${imgUrl}`, dimensions);
          return { ...product, dimensions };
        })
      );

      // Log all categories with their dimensions
      console.log("Categories before sorting:", categoryImages);

      const sortedProducts = categoryImages.sort((a, b) => {
        // Sort by height (descending)
        if (b.dimensions.height !== a.dimensions.height) {
          return b.dimensions.height - a.dimensions.height;
        }
        // If heights are the same, sort by width (ascending)
        return a.dimensions.width - b.dimensions.width;
      });

      // Log sorted products
      console.log("Categories after sorting:", sortedProducts);

      setSortedProducts(sortedProducts);
    };

    fetchAndSortCategories();
  }, [products]);

  return (
    <section className="feature_section sec_ptb_140 clearfix">
      <div className="container">
        <div className="sports_section_title text-center mb_100">
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
        <div className="row no-gutters">
          <div className="col-lg-6 col-md-6 col-4">
            {sortedProducts[0]?.category && (
              <div className="sports_feature_fullimage sports_feature_fullimage1">
                <img
                  className="featurecat_mob"
                  src={`${renderUrl}uploads/category/${sortedProducts[0].category.image}`}
                  alt="image_not_found"
                  style={{ maxHeight: "700px", objectFit: "cover" }}
                />
                <div className="item_content text-white">
                  {sortedProducts[0].category.offer && (
                    <span className="sub_title  d-md-block d-none">
                      Get the discount of {sortedProducts[0].category.offer}
                    </span>
                  )}
                  <h3 className="item_title text-uppercase text-white">
                    {sortedProducts[0]?.category?.name}
                  </h3>
                  <Link
                    className="custom_btn d-md-block d-none btn_sm bg_black text-uppercase"
                    to={`/productslist/${sortedProducts[0]?.category._id}`}
                  >
                    View Products
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6 col-md-6 col-4">
            {sortedProducts[1]?.category && (
              <div className="sports_feature_fullimage sports_feature_fullimage2">
                <img
                  className="featurecat_mob"
                  src={`${renderUrl}uploads/category/${sortedProducts[1].category.image}`}
                  alt="image_not_found"
                />
                <div className="item_content text-white">
                  {sortedProducts[1].category.offer && (
                    <span className="sub_title">
                      Get the discount of {sortedProducts[1].category.offer}
                    </span>
                  )}
                  <h3 className="item_title text-uppercase text-white">
                    {sortedProducts[1]?.category?.name}
                  </h3>
                  <Link
                    className="custom_btn btn_sm d-md-block d-none bg_black text-uppercase"
                    to={`/productslist/${sortedProducts[1]?.category._id}`}
                  >
                    View Product
                  </Link>
                </div>
              </div>
            )}
            {sortedProducts[2]?.category && (
              <div className="sports_feature_fullimage  d-md-block d-none sports_feature_fullimage3">
                <img
                  src={`${renderUrl}uploads/category/${sortedProducts[2].category.image}`}
                  alt="image_not_found"
                />
                <div className="item_content text-white">
                  {sortedProducts[2].category.offer && (
                    <span className="sub_title">
                      Get the discount of {sortedProducts[2].category.offer}
                    </span>
                  )}
                  <h3 className="item_title text-uppercase text-white">
                    {sortedProducts[2]?.category?.name}
                  </h3>
                  <Link
                    className="custom_btn btn_sm bg_black text-uppercase"
                    to={`/productslist/${sortedProducts[2]?.category._id}`}
                  >
                    View Product
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-6 col-4  d-md-none d-block">
            {sortedProducts[2]?.category && (
              <div className="sports_feature_fullimage  d-md-none d-block sports_feature_fullimage3">
                <img
                  className="featurecat_mob"
                  src={`${renderUrl}uploads/category/${sortedProducts[2].category.image}`}
                  alt="image_not_found"
                />
                <div className="item_content text-white">
                  {sortedProducts[2].category.offer && (
                    <span className="sub_title">
                      Get the discount of {sortedProducts[2].category.offer}
                    </span>
                  )}
                  <h3 className="item_title text-uppercase text-white">
                    {sortedProducts[2]?.category?.name}
                  </h3>
                  <Link
                    className="custom_btn d-md-block d-none btn_sm bg_black text-uppercase"
                    to={`/productslist/${sortedProducts[2]?.category._id}`}
                  >
                    View Product
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCategorySection;
