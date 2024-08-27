const express = require("express");
const router = express.Router();
const productctrl = require("../../controllers/Product.Ctrl");
const multer = require("multer");
const path = require("path");

router.get("/getallproducts", productctrl.getAllProducts);
router.get("/getproductbycat/:categoryId", productctrl.getProductsByCategory);
router.get("/singleproduct/:id", productctrl.getProductById);

// getAllProductsWtLazyLoad
router.post("/getallproducts/lazy", productctrl.getAllProductsWtLazyLoad);
router.post(
  "/getproductbycat/lazy/:categoryId",
  productctrl.getAllProductsWtLazyLoad
);

// related products with multiple categories
router.post(
  "/getproductbycat/multiple/lazy",
  productctrl.getAllProductsWtLazyLoadMultiple
);

router.get("/featured-products/home", productctrl.getFeaturedProductsforhome);


module.exports = router;
