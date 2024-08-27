import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../ProductCard";
import { axiosInstance } from "../../config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const RelatedProducts = ({ categories }) => {
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalproducts, settotalproducts] = useState(0);
  const [relatedProducts, setrelatedProducts] = useState([]);
  const observer = useRef();
  const settings5 = {
    dots: false,
    speed: 1000,
    arrows: true,
    infinite: false,
    autoplay: false,
    slidesToShow: 5, // Default slides to show
    pauseOnHover: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
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
          slidesToShow: 2,
        },
      },
    ],
  };

  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    // alert("called");
    try {
      let url = `client/product/getproductbycat/multiple/lazy?offset=${offset}&limit=${limit}`;
      // alert(url);
      const response = await axiosInstance.post(url, { categories });

      const newProducts = response.data.data;

      setrelatedProducts([...relatedProducts, ...newProducts]);
      setOffset(offset + limit);
      setHasMore(newProducts.length > 0);
      settotalproducts(response.data.total);
      console.log(newProducts, "newProducts");
    } catch (error) {
      console.error("Error fetching relatedProducts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categories]);

  const lastProductElementRef = (node) => {
    if (loading) return;
    console.log(offset, "lazy");
    if (!loading) {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // alert(`total products - ${products.length}`);
          fetchProducts();
          // setOffset(products.length + limit);
        }
      });

      if (node) observer.current.observe(node);
    }
  };

  return (
    <div>
      <div className="sports_related_products">
        <div className="sports_section_title text-uppercase">
          <span className="sub_title mb-0">Similar Products</span>
          {/* <h3 className="title_text mb-0">Related Products</h3> */}
        </div>
        <div className="my-2 related_products_slides">
          <Slider {...settings5}>
            {relatedProducts.map((el, index) => (
              <div key={index} className="px-2">
                <ProductCard product={el} id={el._id} />
              </div>
            ))}
            {totalproducts > relatedProducts.length && !loading && (
              <div ref={lastProductElementRef} className="px-2"></div>
            )}
            {loading && (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-panel" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </Slider>
        </div>
        {/* <div className="d-flex related_products_slides flex-nowrap justify-content-center">
          {relatedProducts?.map((el, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <ProductCard product={el} id={el._id} />
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default RelatedProducts;
