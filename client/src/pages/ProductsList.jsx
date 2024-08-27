import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import useScrollTo from "../components/useScrollTo";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { axiosInstance } from "../config";

const ProductListCopy = () => {
  const location = useLocation();
  const { cid } = useParams();
  const selector = "products-list";
  const [sortOption, setSortOption] = useState("Relevance");
  const [range, setRange] = useState([0, 5000]);
  const [offcanvas, setoffcanvas] = useState(false);
  const [categories, setcategories] = useState([]);
  const [catName, setcatName] = useState("All Products");
  const [searchValue, setsearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(6);
  const [totalproducts, settotalproducts] = useState(0);
  const [products, setproducts] = useState([]);
  const [applyRange, setapplyRange] = useState(false);
  const observer = useRef();
  const navigate = useNavigate("");
  const [filters, setfilters] = useState({
    range: [],
    sortby: null,
    search: "",
  });
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (
      searchParams.get("search") !==
      ("" || "undefined" || undefined || " " || null)
    ) {
      setfilters({
        ...filters,
        search: searchParams.get("search"),
      });
      setsearchValue(searchParams.get("search"));
      setproducts([]);
      // alert(`useffect 1 ${offset}`);
      setHasMore(true);
      setOffset(0);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`client/cat/get/allcategories`);
      console.log(response.data.data);
      setcategories(response.data.data);
      const cat = response.data.data.find((el) => el._id === cid);
      setcatName(cat.name);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    setOffset(0);
    // alert(`useffect 1 ${offset}`);
    setproducts([]);
    setHasMore(true);
  }, [cid]);

  useEffect(() => {
    if (offset === 0) {
      fetchCategories();
      setproducts([]);
      fetchProducts();
    }
  }, [offset]);

  console.log(offset);

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

  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      let url = `client/product/getallproducts/lazy?offset=${offset}&limit=${limit}`;
      if (cid !== "all") {
        url = `client/product/getproductbycat/lazy/${cid}?offset=${offset}&limit=${limit}`;
        console.log(offset, url);
      }
      console.log(url, "url");

      const response = await axiosInstance.post(url, { filters });

      const newProducts = response.data.data;

      setproducts([...products, ...newProducts]);
      setOffset(offset + limit);
      setHasMore(newProducts.length > 0);
      settotalproducts(response.data.total);
      console.log(newProducts, "newProducts");
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the sort option change
  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
    handlefilterchange("sortOption", event.target.value);
  };
  const handleSliderChange = (value) => {
    setRange(value);
    handlefilterchange("range", value);
    setapplyRange(true);
  };
  const handleMinPriceChange = (e) => {
    const newMinPrice = parseInt(e.target.value);
    const rangeNew = [newMinPrice, range[1]];
    setRange([newMinPrice, range[1]]);
    handlefilterchange("range", rangeNew);
    setapplyRange(true);
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = parseInt(e.target.value);
    const rangeNew = [range[0], newMaxPrice];
    setRange([range[0], newMaxPrice]);
    handlefilterchange("range", rangeNew);
    setapplyRange(true);
  };

  useScrollTo(selector);

  const handlefilterchange = (filter, value) => {
    if (filter === "sortOption") {
      setfilters({
        ...filters,
        sortby: value,
      });

      setproducts([]);
      setOffset(0);
      setHasMore(true);
    } else if (filter === "range") {
      setfilters({
        ...filters,
        range: value,
      });
    }
  };

  const breadlinksWoCat = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/productslist",
      text: "Products",
    },
  ];
  const breadlinksForCat = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/categories",
      text: "Categories",
    },
    {
      url: "/categories",
      text: catName ? catName : "All Products",
    },
  ];

  return (
    <div className="products-list-main-wrapper">
      <Header />
      {/* <ScrollToTop /> */}
      <main className="products-list-main">
        <Breadcrumb
          pagename={"Product list"}
          breadcrumbitems={cid ? breadlinksForCat : breadlinksWoCat}
          backgroundimg={"/assets/images/breadcrumb/bg_14.jpg"}
        />
        {/* product_section - start
    ================================================== */}
        <section
          id="products-list"
          className="product_section sec_ptb_100 clearfix"
        >
          <div className="container">
            <div className="row mx-0">
              <div className="col-md-3 col-12">
                <div className="offcanvas-body sports_sidebar px-3 d-md-block d-none">
                  <h5 className="title">Sort :</h5>
                  <div className="product-short ">
                    <select
                      className="nice-select mb-3"
                      name="sortby"
                      value={sortOption}
                      onChange={handleSortOptionChange}
                    >
                      <option value="Relevance">Relevance</option>
                      {/* <option value="Popularity">Popularity</option> */}
                      <option value="Low to High">Price (Low to High)</option>
                      <option value="High to Low">Price (High to Low)</option>
                      {/* <option value="ratingHighest">
                        Rating (Highest)
                      </option> */}
                    </select>
                  </div>
                  <div className="shop-sidebar mb-30">
                    <hr />
                    <h5 className="title">FILTER BY PRICE</h5>
                    {/* filter-price-content start */}
                    <div className="filter-price-content">
                      {/* <Slider
                      range
                      min={0}
                      max={5000}
                      value={range}
                      onChange={handleSliderChange}
                    /> */}
                      <RangeSlider
                        min={0}
                        max={5000}
                        value={range}
                        onInput={handleSliderChange}
                      />

                      <div className="filter-price-wapper">
                        <span>Price:</span>
                        <div className="row mx-0 py-2">
                          <div className="range-input col-4 p-0">
                            <input
                              type="number"
                              className="col-12 form-control p-0 text-center"
                              id="min-price"
                              value={range[0]}
                              onChange={handleMinPriceChange}
                            />
                          </div>
                          <span className="col-1 p-0 text-center">—</span>
                          <div className="range-input col-6 p-0">
                            <input
                              type="number"
                              className="col-12 form-control p-0 text-center"
                              id="max-price"
                              value={range[1]}
                              onChange={handleMaxPriceChange}
                            />
                          </div>
                          {/* <Link className="add-to-cart-button" to="#">
                        <span>FILTER</span>
                      </Link> */}
                        </div>
                      </div>
                      {applyRange && (
                        <div className="text-right">
                          <button
                            onClick={() => {
                              setproducts([]);
                              setapplyRange(false);
                              setOffset(0);
                              setHasMore(true);
                            }}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Apply
                          </button>
                        </div>
                      )}

                      <div className="text-left">
                        <button
                          onClick={() => {
                            setfilters({
                              range: [],
                              sortby: null,
                            });
                            setSortOption("Relevance");
                            setproducts([]);
                            setapplyRange(false);
                            setOffset(0);
                            setHasMore(true);
                          }}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Reset filters
                        </button>
                      </div>
                    </div>
                    {/* filter-price-content end */}
                  </div>
                  <div className="sb_widget sb_category">
                    <h3 className="sb_widget_title text-uppercase">
                      Categories
                    </h3>
                    <ul className="ul_li_block clearfix">
                      <li>
                        <Link
                          to={`/productslist/all`}
                          className={`${"all" === cid && cid ? "active" : ""}`}
                        >
                          <i className="fas fa-caret-right mr-2"></i> All
                          Categories
                          {/* <span>(68)</span> */}
                        </Link>
                      </li>
                      {categories.map((cat, index) => (
                        <li key={cat._id}>
                          <Link
                            to={`/productslist/${cat._id}`}
                            className={`${
                              cat._id.toString() === cid && cid ? "active" : ""
                            }`}
                          >
                            <i className="fas fa-caret-right mr-2"></i>{" "}
                            {cat.name}
                            {/* <span>(68)</span> */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* <div className="shop-sidebar mb-30">
                <h4 className="title">CATEGORIES</h4>
                <ul>
                  {categories.map((cat, index) => (
                    <li key={cat._id}>
                      <Link to={`/productslist/${cat._id}`}>{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div> */}
                </div>
              </div>
              <div className="col-md-9 col-12 product-list-col">
                <div
                  className={`offcanvas ${offcanvas ? "open" : ""}`}
                  id="offcanvasExample"
                >
                  <div className="offcanvas-header  d-flex align-items-center px-3 pt-2 justify-content-between">
                    <h4>Filters</h4>
                    <button
                      type="button"
                      onClick={() => setoffcanvas(!offcanvas)}
                      className="btn shadow-none"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <hr />
                  <div className="offcanvas-body px-3">
                    <h5 className="title">Sort :</h5>
                    <div className="product-short ">
                      <select
                        className="nice-select mb-3"
                        name="sortby"
                        value={sortOption}
                        onChange={handleSortOptionChange}
                      >
                        <option value="Relevance">Relevance</option>
                        {/* <option value="Popularity">Popularity</option> */}
                        <option value="Low to High">Price (Low to High)</option>
                        <option value="High to Low">Price (High to Low)</option>
                      </select>
                    </div>
                    <div className="shop-sidebar mb-30">
                      <hr />
                      <h5 className="title">FILTER BY PRICE</h5>
                      {/* filter-price-content start */}
                      <div className="filter-price-content">
                        {/* <Slider
                      range
                      min={0}
                      max={5000}
                      value={range}
                      onChange={handleSliderChange}
                    /> */}
                        <RangeSlider
                          min={0}
                          max={5000}
                          value={range}
                          onInput={handleSliderChange}
                        />
                        <div className="filter-price-wapper">
                          <span>Price:</span>
                          <div className="row mx-0 py-2">
                            <div className="range-input col-3">
                              <input
                                type="number"
                                className="col-12 form-control p-0 text-center"
                                id="min-price"
                                value={range[0]}
                                onChange={handleMinPriceChange}
                              />
                            </div>
                            <span className="col-1">—</span>
                            <div className="range-input col-6">
                              <input
                                type="number"
                                className="col-12 form-control p-0 text-center"
                                id="max-price"
                                value={range[1]}
                                onChange={handleMaxPriceChange}
                              />
                            </div>
                            {/* <Link className="add-to-cart-button" to="#">
                        <span>FILTER</span>
                      </Link> */}
                          </div>
                        </div>
                        {applyRange && (
                          <div className="text-center">
                            <button
                              onClick={() => {
                                setproducts([]);
                                setapplyRange(false);
                                setOffset(0);
                                setHasMore(true);
                              }}
                              className="btn btn-outline-danger"
                            >
                              Apply
                            </button>
                          </div>
                        )}{" "}
                        <div className="text-left">
                          <button
                            onClick={() => {
                              setfilters({
                                range: [],
                                sortby: null,
                              });
                              setSortOption("Relevance");
                              setproducts([]);
                              setapplyRange(false);
                              setOffset(0);
                              setHasMore(true);
                            }}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            Reset filters
                          </button>
                        </div>
                      </div>
                      {/* filter-price-content end */}
                    </div>
                    <div className="sb_widget sb_category">
                      <h3 className="sb_widget_title text-uppercase">
                        Categories
                      </h3>
                      <ul className="ul_li_block clearfix">
                        {" "}
                        <li className="border-0">
                          <Link
                            to={`/productslist/all`}
                            className={`${
                              "all" === cid && cid ? "active" : ""
                            }`}
                          >
                            <i className="fas fa-caret-right mr-2"></i> All
                            Categories
                            {/* <span>(68)</span> */}
                          </Link>
                        </li>
                        {categories.map((cat, index) => (
                          <li className="border-0" key={cat._id}>
                            <Link
                              to={`/productslist/${cat._id}`}
                              className={`${
                                cat._id.toString() === cid && cid
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <i className="fas fa-caret-right mr-2"></i>{" "}
                              {cat.name}
                              {/* <span>(68)</span> */}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="sb_widget sb_search">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setproducts([]);
                      setHasMore(true);
                      setOffset(0);
                      setsearchValue(filters.search);
                      navigate(`/productslist/${cid}?search=${filters.search}`);
                    }}
                  >
                    <div className="form_item mb-0 position-relative">
                      <input
                        type="text"
                        onChange={(e) => {
                          setfilters({
                            ...filters,
                            search: e.target.value,
                          });
                        }}
                        value={filters.search}
                        name="search"
                        placeholder="Search ... "
                      />
                      {filters.search && (
                        <button
                          type="button"
                          onClick={() => {
                            setfilters({
                              ...filters,
                              search: "",
                            });
                            setsearchValue("");
                            setproducts([]);
                            setHasMore(true);
                            setOffset(0);
                            navigate(`/productslist/${cid}`);
                          }}
                          className="btn shadow-none btn_reset_search"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                {searchValue && (
                  <div className="search_text_show">
                    <p>Showing results for : {searchValue}</p>
                  </div>
                )}
                <div className="carparts_filetr_bar clearfix">
                  <div className="row align-items-center justify-content-lg-between">
                    <div className="col-12">
                      <p className="result_text text-left m-0">
                        Showing {products.length} of {totalproducts} results
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row mx-0 justify-content-center">
                  {products?.map((product, index) => {
                    let backurl = "";
                    if (cid) {
                      backurl = `${cid}`;
                    }

                    return (
                      <div
                        key={index}
                        className="col-lg-4 col-md-6 col-sm-6 col-xs-6 col-6 product-card-col"
                        //   ref={
                        //     index === products.length - 1
                        //       ? lastProductElementRef
                        //       : null
                        //   }
                      >
                        <ProductCard
                          backurl={backurl}
                          product={product}
                          id={product._id}
                        />
                      </div>
                    );
                  })}
                  {totalproducts > limit && !loading && (
                    <div
                      ref={lastProductElementRef}
                      className="col-12 p-0 m-0"
                    ></div>
                  )}
                  {products.length > 0 && products.length === totalproducts && (
                    <>
                      <div className="text-center py-3 col-12">
                        <p className="">You are at the end of the list</p>
                      </div>
                    </>
                  )}
                  {products.length === 0 && !loading && (
                    <>
                      <div className="text-center py-3 col-12">
                        <p className="">No products found</p>
                      </div>
                    </>
                  )}
                </div>
                {loading && (
                  <div className="d-flex justify-content-center py-3">
                    <div className="spinner-border text-panel" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <div className="filters-bottom-fixed d-md-none d-block">
          <div className="row mx-0">
            <div className="col-12 sort-collapse p-0">
              <div className="collapse" id="sortbycollapse">
                <div className="card card-body border-0 p-0">
                  <div className="card-header d-flex justify-content-between align-items-center ">
                    <h6>
                      <i className="fas fa-sort-alt"></i> Sort by
                    </h6>
                    <button
                      data-toggle="collapse"
                      data-target="#sortbycollapse"
                      className="close"
                      type="button"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="list-group">
                    <button
                      type="button"
                      data-toggle="collapse"
                      data-target="#sortbycollapse"
                      name="Relevance"
                      onClick={(e) => setSortOption(e.target.name)}
                      className={`list-group-item list-group-item-action border-0 ${
                        sortOption === "Relevance" ? "active" : ""
                      }`}
                    >
                      Relevance
                    </button>{" "}
                    {/* <button
                          type="button"
                          data-toggle="collapse"
                          data-target="#sortbycollapse"
                          name="Popularity"
                          onClick={(e) => setSortOption(e.target.name)}
                          className={`list-group-item list-group-item-action border-0 ${
                            sortOption === "Popularity" ? "active" : ""
                          }`}
                        >
                          Popularity
                        </button> */}
                    <button
                      type="button"
                      data-toggle="collapse"
                      data-target="#sortbycollapse"
                      name="Low to High"
                      onClick={(e) => setSortOption(e.target.name)}
                      className={`list-group-item list-group-item-action border-0 ${
                        sortOption === "Low to High" ? "active" : ""
                      }`}
                    >
                      Low to High
                    </button>
                    <button
                      type="button"
                      data-toggle="collapse"
                      data-target="#sortbycollapse"
                      name="High to Low"
                      onClick={(e) => setSortOption(e.target.name)}
                      className={`list-group-item list-group-item-action border-0 ${
                        sortOption === "High to Low" ? "active" : ""
                      }`}
                    >
                      High to Low
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 p-0">
              <button
                data-toggle="collapse"
                data-target="#sortbycollapse"
                aria-expanded="false"
                aria-controls="sortbycollapse"
                className="btn shadow-none btn-block"
              >
                <i className="fas fa-sort-alt"></i> Sort
              </button>
            </div>
            <div className="col-6 p-0">
              {" "}
              <button
                onClick={() => setoffcanvas(!offcanvas)}
                className="btn shadow-none btn-block"
              >
                <i className="far fa-sliders-h"></i> Filter
              </button>
            </div>
          </div>
        </div>
        {/* product_section - end
    ================================================== */}
      </main>
      <Footer />
    </div>
  );
};

export default ProductListCopy;
