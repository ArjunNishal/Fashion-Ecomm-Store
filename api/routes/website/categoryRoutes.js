const express = require("express");
const router = express.Router();
const catCtrl = require("../../controllers/CategoryCtrl");

router.get("/get/category/:id", catCtrl.getCategory);
router.get("/get/allcategories", catCtrl.getAllCategories);
router.get("/get/categories", catCtrl.getCategoriesWithPagination);

module.exports = router;
