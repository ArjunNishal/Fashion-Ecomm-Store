const express = require("express");
const router = express.Router();
const catCtrl = require("../../controllers/CategoryCtrl");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/category/"); // You might want to change this to your desired upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `cat-` + Date.now() + path.extname(file.originalname)); // Rename file with current timestamp
  },
});

const upload = multer({
  storage: storage,
});

router.post("/create/category", upload.single("image"), catCtrl.createCategory);
router.put("/edit/category/:id", upload.single("image"), catCtrl.editCategory);
router.patch("/edit/category/:id/status", catCtrl.editCategoryStatus);
router.get("/get/category/:id", catCtrl.getCategory);
router.get("/get/allcategories", catCtrl.getAllCategories);
router.get("/get/categories", catCtrl.getCategoriesWithPagination);

router.get("/featured-categories", catCtrl.getFeaturedCategories);

module.exports = router;
