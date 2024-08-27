const Category = require("../models/CategorySchema");
const { pagination } = require("./pagination");
const fs = require("fs");
const path = require("path");

exports.createCategory = async (req, res) => {
  try {
    const { name, featureCategory, offer } = req.body;
    const image = req.file ? req.file.filename : null;

    const duplicatecat = await Category.findOne({ name: name });

    if (duplicatecat) {
      if (req.file) {
        const ImagePath = `uploads/category/${req.file.filename}`;
        // Delete the old image file if it exists
        if (fs.existsSync(ImagePath)) {
          fs.unlink(ImagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            }
          });
        }
      }

      return res.status(500).send({
        status: false,
        message: "Category with same name already exists",
      });
    }

    const newCategory = new Category({
      name,
      image,
      createdby: req.user,
      featureCategory,
      offer,
    });

    await newCategory.save();

    res.status(200).json({
      status: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while creating the category",
      error,
    });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, featureCategory, offer } = req.body;
    console.log(offer);

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    const duplicatecat = await Category.findOne({
      name: name,
      _id: { $ne: categoryId },
    });

    if (duplicatecat) {
      if (req.file) {
        const ImagePath = `uploads/category/${req.file.filename}`;
        // Delete the old image file if it exists
        if (fs.existsSync(ImagePath)) {
          fs.unlink(ImagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            }
          });
        }
      }

      return res.status(500).send({
        status: false,
        message: "Category with same name already exists",
      });
    }

    let image = category.image;

    if (req.file) {
      // Get the old category to find the current image
      //   const oldCategory = await Category.findById(categoryId);
      if (category && category.image) {
        const oldImagePath = `uploads/category/${category.image}`;
        // Delete the old image file if it exists
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Error deleting old image:", err);
            }
          });
        }
      }
      image = req.file.filename;
    }

    category.image = image;
    category.name = name;
    category.updatedby = req.user;
    category.featureCategory = featureCategory;
    category.offer = offer;

    const savedcat = await category.save();

    res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: savedcat,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the category",
      error,
    });
  }
};

exports.editCategoryStatus = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { status } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    category.status = status;
    category.featureCategory = status !== 1 ? 0 : category.featureCategory;
    const updatedCategory = await category.save();

    res.status(200).json({
      status: true,
      message: "Category status updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category status:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the category status",
      error,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId).populate("createdby");

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the category",
      error,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("createdby")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the categories",
      error,
    });
  }
};

exports.getCategoriesWithPagination = async (req, res) => {
  try {
    const DBQuery = Category.find()
      .populate("createdby")
      .sort({ createdAt: -1 }); // Base query for fetching categories
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const results = await pagination(Category, DBQuery, limitQuery);

    res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching categories with pagination:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching categories",
      error,
    });
  }
};

exports.getFeaturedCategories = async (req, res) => {
  try {
    const DBQuery = Category.find({ featureCategory: 1 })
      .populate("createdby")
      .sort({ createdAt: -1 }); // Base query for fetching categories
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const results = await pagination(Category, DBQuery, limitQuery);

    // const featuredCategories = await Category.find({ featureCategory: 1 });
    res.status(200).json({
      status: true,
      message: "Featured categories fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching featured categories",
      error,
    });
  }
};
