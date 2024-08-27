const express = require("express");
const router = express.Router();
const productctrl = require("../../controllers/Product.Ctrl");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product/"); // You might want to change this to your desired upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `pro-` + Date.now() + path.extname(file.originalname)); // Rename file with current timestamp
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/createproduct",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 200 },
  ]),
  productctrl.createProduct
);

router.post(
  "/upload/image",
  // upload.single("upload"),
  upload.array("files"),
  productctrl.uploadImage
);

router.get("/getallproducts", productctrl.getAllProducts);
router.get("/getproduct/:id", productctrl.getProductById);
router.put(
  "/editproduct/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  productctrl.editProduct
);
router.put("/editproduct/status/:id", productctrl.editProductStatus);
router.get("/getproductbycat/:categoryId", productctrl.getProductsByCategory);

// Route to edit a review of a product
router.put("/editreview/:productId/:reviewId", productctrl.editReview);

// Route to remove a review from a product
router.delete("/delete_review/:productId/:reviewId", productctrl.removeReview);

router.get("/featured-products", productctrl.getFeaturedProducts);

router.get(
  "/featured-products/:categoryId",
  productctrl.getFeaturedProductsByCategory
);

module.exports = router;
