// import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Categories from "./pages/Categories";
import Productpage from "./pages/Productpage";
import ProductsList from "./pages/ProductsList";
import Checkout from "./pages/checkout/Checkout";
import CheckoutTwo from "./pages/checkout/CheckoutTwo";
import CheckoutThree from "./pages/checkout/CheckoutThree";
import Cartpage from "./pages/Cartpage";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Aboutus from "./pages/Aboutus";
import Profile from "./pages/Profile";
import ForgotPasswordUser from "./pages/ForgotPasswordUser";
import ResetpasswordUser from "./pages/ResetpasswordUser";
import Resetpassword from "./panel/pages/Resetpassword";
import ForgotPassword from "./panel/pages/ForgotPassword";
import Protect from "./Protect";
import LoginAdmin from "./panel/pages/LoginAdmin";
import Admin from "./panel/pages/dashboard/Admin";
import ProtectAdmin from "./panel/components/ProtectAdmin";
import { fetchdynamiccss } from "./components/int";
import { useEffect } from "react";
import ProfilePanel from "./panel/pages/profile/ProfilePanel";
import AdminsList from "./panel/pages/admins/AdminsList";
import UsersList from "./panel/pages/Users/UsersList";
import CategoriesList from "./panel/pages/category/CategoriesList";
import ProductsListPanel from "./panel/pages/products/ProductsListPanel";
import CreateProduct from "./panel/pages/products/CreateProduct";
import EditProduct from "./panel/pages/products/EditProduct";
import SingleProductPanel from "./panel/pages/products/SingleProductPanel";
import ProductsByCatList from "./panel/pages/products/ProductsByCatList";
import ProductListCopy from "./pages/ProductListCopy";
import FeatureProductByCat from "./panel/pages/products/FeatureProductByCat";
import FeaturedProductsList from "./panel/pages/products/FeaturedProductsList";
import FeaturedCatList from "./panel/pages/category/FeaturedCatList";
import QueryPage from "./pages/QueryPage";
import QueryList from "./panel/pages/Query/QueryList";
import ContactUsList from "./panel/pages/contactus/ContactUsList";
import { useDispatch } from "react-redux";
import { fetchCartDetails } from "./Redux/reducers/cartSlice";
import PendingPayment from "./pages/checkout/PendingPayment";
import OrdersList from "./panel/pages/orders/OrdersList";
import SingleOrder from "./panel/pages/orders/SingleOrder";
import Newsletter from "./panel/pages/newsletter/Newsletter";
import CreateNewsletter from "./panel/pages/newsletter/CreateNewsletter";
import OffersNdCoupons from "./panel/pages/offers&Coupons/OffersNdCoupons";
import SubscribersList from "./panel/pages/newsletter/SubscribersList";

function App() {
  useEffect(() => {
    fetchdynamiccss();
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartDetails());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:pid" element={<Productpage />} />
        <Route path="/productslist/:cid" element={<ProductsList />} />
        <Route path="/checkout" element={<CheckoutTwo />} />
        <Route path="/checkout-two" element={<CheckoutThree />} />
        <Route path="/checkout-three" element={<CheckoutThree />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPasswordUser />} />
        <Route path="/resetpassword" element={<ResetpasswordUser />} />
        <Route path="/forgotpassword_panel" element={<ForgotPassword />} />
        <Route path="/resetpassword_panel" element={<Resetpassword />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/reqaquery" element={<QueryPage />} />
        <Route path="/payment/:oid" element={<PendingPayment />} />
        <Route path="/profile" element={<Protect Component={Profile} />} />
        {/* panel --------------------------------------------------------------------*/}
        <Route path="/panel_adminlogin" element={<LoginAdmin />} />
        <Route
          path="/panel_dashboard"
          element={<ProtectAdmin Component={Admin} />}
        />
        <Route
          path="/panel_profile"
          element={<ProtectAdmin Component={ProfilePanel} />}
        />
        <Route
          path="/panel_admins"
          element={<ProtectAdmin Component={AdminsList} />}
        />
        <Route
          path="/panel_users"
          element={<ProtectAdmin Component={UsersList} />}
        />
        <Route
          path="/panel_categories"
          element={<ProtectAdmin Component={CategoriesList} />}
        />

        <Route
          path="/panel_products"
          element={<ProtectAdmin Component={ProductsListPanel} />}
        />
        <Route
          path="/panel_createproduct"
          element={<ProtectAdmin Component={CreateProduct} />}
        />
        <Route
          path="/panel_editproduct"
          element={<ProtectAdmin Component={EditProduct} />}
        />
        <Route
          path="/panel_product"
          element={<ProtectAdmin Component={SingleProductPanel} />}
        />
        <Route
          path="/panel_catproduct"
          element={<ProtectAdmin Component={ProductsByCatList} />}
        />
        <Route
          path="/panel_featureproducts"
          element={<ProtectAdmin Component={FeaturedProductsList} />}
        />
        <Route
          path="/panel_featurecatproducts"
          element={<ProtectAdmin Component={FeatureProductByCat} />}
        />
        <Route
          path="/panel_featurecat"
          element={<ProtectAdmin Component={FeaturedCatList} />}
        />
        <Route
          path="/panel_queryList"
          element={<ProtectAdmin Component={QueryList} />}
        />
        <Route
          path="/panel_contactList"
          element={<ProtectAdmin Component={ContactUsList} />}
        />
        <Route
          path="/panel_orders"
          element={<ProtectAdmin Component={OrdersList} />}
        />
        <Route
          path="/panel_order"
          element={<ProtectAdmin Component={SingleOrder} />}
        />
        <Route
          path="/panel_newsletter"
          element={<ProtectAdmin Component={Newsletter} />}
        />
        <Route
          path="/panel_createnewsletter"
          element={<ProtectAdmin Component={CreateNewsletter} />}
        />
        <Route
          path="/panel_offersandcoupons"
          element={<ProtectAdmin Component={OffersNdCoupons} />}
        />
        <Route
          path="/panel_subscribers"
          element={<ProtectAdmin Component={SubscribersList} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
