import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { callcolorsfunction, closeSearchModal } from "./int";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, renderUrl } from "../config";
import NavCart from "./NavCart";
import { useDispatch, useSelector } from "react-redux";
import { clearCartAPI, clearCartLocal } from "../Redux/reducers/cartSlice";

const Header = () => {
  const [token, settoken] = useState(localStorage.getItem("user"));
  const [decoded, setdecoded] = useState({});
  useEffect(() => {
    if (!token) {
      return;
    } else if (token !== (undefined || null || "" || "undefined")) {
      settoken(token);
      // console.log(token);
      const decoded2 = jwtDecode(token);
      setdecoded(decoded2);
    }
  }, [token]);
  // console.log(decoded, "==== decoded =====");

  const navigate = useNavigate("");

  useEffect(() => {
    callcolorsfunction();
  }, []);

  const [categories, setcategories] = useState([]);

  const [activaclass, setactivaclass] = useState(false);
  const [activaclassoverlay, setactivaclassoverlay] = useState(false);

  const [searchvalue, setsearchvalue] = useState("");

  const togglesidebar = () => {
    setactivaclass(true);
    setactivaclassoverlay(true);
  };

  const closetogglesidebar = () => {
    setactivaclass(false);
    setactivaclassoverlay(false);
  };

  const [cartactivaclass, setcartactivaclass] = useState(false);

  const carttogglesidebar = () => {
    setcartactivaclass(true);
    setactivaclassoverlay(true);
  };

  const closecarttogglesidebar = () => {
    setcartactivaclass(false);
    setactivaclassoverlay(false);
  };

  const closesidebar = () => {
    setactivaclass(false);
    setcartactivaclass(false);
    setactivaclassoverlay(false);
  };

  const dispatch = useDispatch();

  const handlelogout = () => {
    // alert("logout");
    localStorage.removeItem("user");
    navigate("/");
    dispatch(clearCartLocal());
    settoken("");
  };

  // fetch categories

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`client/cat/get/allcategories`);
      // console.log(response.data.data);
      setcategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/productslist/all?search=${searchvalue}`);
    closeSearchModal();
  };

  const cartData = useSelector((state) => state.cart);

  return (
    <>
      <header className="header_section sports_header sticky_header d-flex align-items-center clearfix">
        <div className="container-fluid prl_100">
          <div className="row align-items-center">
            <div className="col-6">
              <div className="brand_logo">
                <Link className="brand_link" to="/">
                  <img
                    src="/assets/images/logo/logo_32_1x.png"
                    srcSet="/assets/images/logo/logo_32_2x.png 2x"
                    alt="logo_not_found"
                  />
                </Link>
              </div>
            </div>
            <div className="col-6">
              <div className="header_btns_group d-flex align-items-center justify-content-end">
                <ul className="circle_social_links ul_li clearfix">
                  <li>
                    {/* <a href="#!">
                      <i className="fab fa-facebook-f" />
                    </a> */}
                    <button
                      to={"#"}
                      className="search_btn"
                      data-toggle="modal"
                      data-target="#searchmodal"
                      aria-expanded="false"
                      aria-controls="search_body_collapse"
                    >
                      <i className="fal fa-search"></i>
                    </button>
                  </li>{" "}
                  {token && (
                    <li>
                      <Link to="/profile">
                        <i className="fas fa-user"></i>
                      </Link>
                    </li>
                  )}
                </ul>
                <ul className="header_action_btns ul_li clearfix">
                  <li>
                    <button
                      type="button"
                      onClick={carttogglesidebar}
                      className="cart_btn"
                    >
                      <i className="fas fa-shopping-cart" />
                      {cartData.items.length > 0 && (
                        <span className="btn_badge">
                          {cartData.items.length}
                        </span>
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => togglesidebar()}
                      className="mobile_menu_btn"
                    >
                      <i className="far fa-bars" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div>
        {/* Button trigger modal */}

        {/* Modal */}
        <div
          className="modal p-0 m-0 fade"
          id="searchmodal"
          tabIndex={-1}
          aria-labelledby="searchmodalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog m-0 d-flex justify-content-center align-items-center ">
            <div className="modal-content border-0 rounded-0 vh-100">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="closeSearchModalbtn"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="search-container container h-100">
                  <form
                    onSubmit={search}
                    className="row mx-0 justify-content-center align-items-center h-100"
                  >
                    <div className="col-12 border-bottom">
                      <input
                        type="search"
                        name="search"
                        value={searchvalue}
                        onChange={(e) => setsearchvalue(e.target.value)}
                        placeholder="Type here..."
                      />
                      <button type="submit">
                        <i className="fal fa-search"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-menu-wrapper">
        <div className={`cart_sidebar ${cartactivaclass ? "active" : ""}`}>
          <button
            type="button"
            onClick={closecarttogglesidebar}
            className="close_btn"
          >
            <i className="fal fa-times" />
          </button>
          <NavCart />
        </div>
        <div className={`sidebar_mobile_menu ${activaclass ? "active" : ""}`}>
          <button
            type="button"
            onClick={closetogglesidebar}
            className="close_btn"
          >
            <i className="fal fa-times" />
          </button>
          <div className="msb_widget mb-0 brand_logo text-center">
            <Link to="/">
              <img
                src="/assets/images/logo/logo_25_1x.png"
                srcSet="assets/images/logo/logo_25_2x.png 2x"
                alt="logo_not_found"
              />
            </Link>
          </div>
          <div className="msb_widget mobile_menu_list clearfix mb-0">
            {!token && (
              <>
                <div className="login-btns-div row mx-0 mb-3 justify-content-around">
                  <div className="col-6">
                    <Link
                      to="/login"
                      className="custom_btn btn-block rounded btn_sm bg_sports_red text-uppercase"
                    >
                      login
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="/register"
                      className="custom_btn rounded btn-block btn_sm bg_black text-uppercase"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
                {/* <h3 className="title_text mb_15 text-uppercase">
              <i className="far fa-bars mr-2" /> Menu List
            </h3> */}
                <hr />
              </>
            )}
            <ul className="ul_li_block clearfix">
              <li>
                <Link to="/">Home</Link>
              </li>
              {/* <li>
                <Link to="/categories">Categories</Link>
              </li> */}
              {/* <li>
                <Link to="/shop">Categories</Link>
              </li> */}
              <li className="dropdown">
                <a
                  href="#!"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  className="dropdown-toggle"
                >
                  Categories
                </a>
                <div className="dropdown-menu">
                  <div className="row mx-0 category-sidebar-row">
                    <div className="col-4">
                      <div className="category-sidebar-card">
                        <Link
                          to={`/categories`}
                          className="category-sidebar-card-body text-center p-0 mb-3"
                        >
                          <img
                            src="/assets/images/category/fashion/img_03.jpg"
                            alt="category"
                            className="category-sidebar-img"
                          />
                          <b>All Categories</b>
                        </Link>
                      </div>
                    </div>
                    {categories.map((el, index) => (
                      <div key={index} className="col-4">
                        <div className="category-sidebar-card">
                          <Link
                            to={`/productslist/${el._id}`}
                            className="category-sidebar-card-body text-center p-0 mb-3"
                          >
                            <img
                              src={`${renderUrl}uploads/category/${el.image}`}
                              alt="category"
                              onError={(e) => {
                                e.target.src =
                                  "/assets/images/category/fashion/img_03.jpg";
                              }}
                              className="category-sidebar-img"
                            />
                            <b>{el.name}</b>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* <ul className="dropdown-menu">
                  {" "}
                  <li>
                    <Link to="/categories">All Categories</Link>
                  </li>
                  {categories.map((el, index) => (
                    <li className="">
                      <Link to={`/productslist/${index}`}>{el}</Link>
                    </li>
                  ))}
                </ul> */}
              </li>
              <li>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li>
                <Link to="/contactus">Contact Us</Link>
              </li>
            </ul>
          </div>
          {/* {token && (
            <div className="logout-btn text-center">
              <button
                onClick={handlelogout}
                className="custom_btn rounded  btn_sm  bg_black text-uppercase"
              >
                Logout
              </button>
            </div>
          )} */}

          {token && (
            <div className="user_info">
              <h3 className="title_text mb_30 text-uppercase">
                <i className="fas fa-user mr-2" /> {decoded.firstname}{" "}
                {decoded.lastname}
              </h3>
              <div className="profile_info clearfix">
                <div className="user_thumbnail">
                  <img
                    src={`${
                      decoded.image
                        ? `${renderUrl}uploads/profile/${decoded.image}`
                        : "/assets/images/meta/img_01.png"
                    }`}
                    alt="thumbnail_not_found"
                  />
                </div>
                <div className="user_content">
                  <h4 className="user_name">{decoded.firstname}{" "}
                  {decoded.lastname}</h4>
                  {/* <span className="user_title">Seller</span> */}
                </div>
              </div>
              <ul className="settings_options ul_li_block clearfix">
                <li>
                  <Link to="/profile">
                    <i className="fal fa-user-circle" /> Profile
                  </Link>
                </li>

                <li>
                  <button onClick={handlelogout}>
                    <i className="fal fa-sign-out-alt" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div
          onClick={() => {
            closesidebar();
          }}
          className={`overlay  ${activaclassoverlay ? "active" : ""}`}
        />
      </div>
    </>
  );
};

export default Header;
