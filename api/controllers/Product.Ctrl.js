const fs = require("fs");
const path = require("path");
const Product = require("../models/productSchema");
const { pagination } = require("./pagination");
const Category = require("../models/CategorySchema");
const Cart = require("../models/cartSchema");
const User = require("../models/userSchema");
const { constants } = require("../constants");
const { transporter } = require("./emailTransporter");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      quantity,
      note,
      description,
      shortDescription,
      categories,
      type,
      products,
      ShortDescImagesUrls,
      DescImagesUrls,
      price,
      actualPrice,
      discount,
      featureProduct,
    } = req.body;

    const thumbnail = req.files["thumbnail"]
      ? req.files["thumbnail"][0].filename
      : null;
    const images = req.files["images"]
      ? req.files["images"].map((file) => file.filename)
      : [];

    const replaceImageUrls = (content, urls) => {
      let updatedContent = content;
      const regex = /src="([^"]*)"/g; // Regular expression to match src attribute values

      let match;
      let index = 0;
      while ((match = regex.exec(updatedContent)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (urls[index]) {
          updatedContent = updatedContent.replace(match[1], urls[index]);
          index++;
        }
      }
      return updatedContent;
    };

    // console.log(description, "description////");
    // console.log(shortDescription, "shortDescription////");

    const updatedDesc = replaceImageUrls(
      description,
      JSON.parse(DescImagesUrls)
    );
    const updatedShortDesc = replaceImageUrls(
      shortDescription,
      JSON.parse(ShortDescImagesUrls)
    );

    // console.log(DescImagesUrls, "DescImagesUrls////");
    // console.log(ShortDescImagesUrls, "ShortDescImagesUrls////");

    // console.log(updatedDesc, "updatedDesc////");
    // console.log(updatedShortDesc, "updatedShortDesc////");

    // console.log(JSON.stringify(req.body));

    let productsArray = [];
    productsArray = JSON.parse(products);

    const newProduct = new Product({
      productName,
      quantity,
      note,
      description: updatedDesc,
      shortDescription: updatedShortDesc,
      thumbnail,
      images,
      categories: JSON.parse(categories),
      type,
      products: productsArray,
      createdby: req.user,
      price: parseInt(price, 10),
      actualPrice: parseInt(actualPrice, 10),
      discount: parseInt(discount, 10),
      featureProduct,
    });

    await newProduct.save();

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    // Function to remove files
    const {
      productName,
      quantity,
      note,
      description,
      shortDescription,
      categories,
      type,
      products,
      ShortDescImagesUrls,
      DescImagesUrls,
    } = req.body;

    const thumbnail = req.files["thumbnail"]
      ? req.files["thumbnail"][0].filename
      : null;
    const images = req.files["images"]
      ? req.files["images"].map((file) => file.filename)
      : [];

    const removeFiles = (filePaths) => {
      console.log(
        filePathsToRemove,
        "filePathsToRemove ============================="
      );
      filePaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${filePath}`, err);
            } else {
              console.log(`File deleted: ${filePath}`);
            }
          });
        }
      });
    };

    // Collect all file paths to be removed
    let filePathsToRemove = [];

    if (ShortDescImagesUrls) {
      filePathsToRemove = filePathsToRemove.concat(
        JSON.parse(ShortDescImagesUrls).map((url) => {
          const fileName = path.basename(url);
          console.log(fileName, "filename ---------------------------");
          return path.join("uploads/product", fileName);
        })
      );
    }

    // Remove images from DescImagesUrls
    if (DescImagesUrls) {
      filePathsToRemove = filePathsToRemove.concat(
        JSON.parse(DescImagesUrls).map((url) => {
          const fileName = path.basename(url);
          return path.join("uploads/product", fileName);
        })
      );
    }
    if (thumbnail) {
      filePathsToRemove.push(path.join("uploads/product", thumbnail));
    }

    // Remove product images
    if (images.length > 0) {
      filePathsToRemove = filePathsToRemove.concat(
        images.map((image) => path.join("uploads/product", image))
      );
    }
    removeFiles(filePathsToRemove);
    res.status(500).json({
      status: false,
      message: "An error occurred while creating the product",
      error,
    });
  }
};
// Edit a product
exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      productName,
      quantity,
      note,
      description,
      shortDescription,
      categories,
      type,
      products,
      ShortDescImagesUrls,
      DescImagesUrls,
      price,
      actualPrice,
      discount,
      oldimages,
      featureProduct,
    } = req.body;

    // console.log(typeof removedImages);

    const extractImageUrls = (description) => {
      const regex = /src="([^"]*)"/g;
      const urls = [];
      let match;
      while ((match = regex.exec(description)) !== null) {
        urls.push(match[1]);
      }
      return urls;
    };

    const replaceImageUrls = (content, urls) => {
      let updatedContent = content;
      const regex = /src="(blob:[^"]*)"/g;

      let match;
      let index = 0;
      while ((match = regex.exec(updatedContent)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (urls[index]) {
          updatedContent = updatedContent.replace(match[1], urls[index]);
          index++;
        }
      }
      return updatedContent;
    };

    const oldProduct = await Product.findById(productId);
    const oldPrice = oldProduct.price;

    let oldImagesArr = oldProduct.images;

    // all old images of editor content
    let oldShortDescImagesArr = extractImageUrls(oldProduct.shortDescription);
    let oldDescImagesArr = extractImageUrls(oldProduct.description);

    // update new short and descriptiion
    const updatedNewDesc = replaceImageUrls(
      description,
      JSON.parse(DescImagesUrls)
    );
    const updatedNewShortDesc = replaceImageUrls(
      shortDescription,
      JSON.parse(ShortDescImagesUrls)
    );

    // new images that are added in editor content
    let newShortDescImagesArr = extractImageUrls(updatedNewShortDesc);
    let newDescImagesArr = extractImageUrls(updatedNewDesc);

    console.log(
      newShortDescImagesArr,
      newDescImagesArr,
      "newShortDescImagesArr newDescImagesArr"
    );

    // removed images from editor content
    let removedShortDescArray = oldShortDescImagesArr.filter(
      (el) => !newShortDescImagesArr.includes(el)
    );

    let removedDescArray = oldDescImagesArr.filter(
      (el) => !newDescImagesArr.includes(el)
    );

    // update product details
    oldProduct.productName = productName;
    oldProduct.updatedby = req.user;
    oldProduct.quantity = quantity;
    oldProduct.type = type;
    oldProduct.price = parseInt(price, 10);
    oldProduct.actualPrice = parseInt(actualPrice, 10);
    oldProduct.discount = parseInt(discount, 10);
    oldProduct.categories = JSON.parse(categories);
    oldProduct.products = products ? JSON.parse(products) : [];
    oldProduct.note = note;
    oldProduct.shortDescription = updatedNewShortDesc;
    oldProduct.description = updatedNewDesc;
    oldProduct.featureProduct = featureProduct;

    // Handle thumbnail update
    if (req.files["thumbnail"]) {
      if (oldProduct && oldProduct.thumbnail) {
        const oldThumbnailPath = `uploads/product/${oldProduct.thumbnail}`;
        // Check if the file exists before deleting
        if (fs.existsSync(oldThumbnailPath)) {
          fs.unlink(oldThumbnailPath, (err) => {
            if (err) {
              console.error("Error deleting old thumbnail:", err);
            }
          });
        }
      }
      oldProduct.thumbnail = req.files["thumbnail"][0].filename;
    }

    if (req.files["images"]) {
      let newImagesArray = req.files["images"].map((file) => file.filename);

      let removedProductImages = oldImagesArr.filter(
        (el) => !oldimages.includes(el)
      );

      // Remove old images from server
      removedProductImages.forEach((image) => {
        const imagePath = `uploads/product/${image}`;
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Error deleting old image: ${imagePath}`, err);
            }
          });
        }
      });

      // Remove old images from images array
      oldImagesArr = oldImagesArr.filter(
        (el) => !removedProductImages.includes(el)
      );

      // Add new images to images array
      oldImagesArr = [...oldImagesArr, ...newImagesArray];

      oldProduct.images = oldImagesArr;
    }

    const allRemovedImages = [...removedShortDescArray, ...removedDescArray];

    allRemovedImages.forEach((imageUrl) => {
      const imageName = imageUrl.split("/").pop();
      const imagePath = `uploads/product/${imageName}`;
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(
              `Error deleting old image from description: ${imagePath}`,
              err
            );
          }
        });
      }
    });

    const updatedProduct = await oldProduct.save();

    // Check for price drop

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });

    if (oldPrice > updatedProduct.price) {
      await notifyUsersOfPriceDrop(
        updatedProduct._id,
        oldPrice,
        updatedProduct.price
      );
    }
  } catch (error) {
    const {
      productName,
      quantity,
      note,
      description,
      shortDescription,
      categories,
      type,
      products,
      ShortDescImagesUrls,
      DescImagesUrls,
    } = req.body;

    const thumbnail = req.files["thumbnail"]
      ? req.files["thumbnail"][0].filename
      : null;
    const images = req.files["images"]
      ? req.files["images"].map((file) => file.filename)
      : [];

    const removeFiles = (filePaths) => {
      console.log(
        filePathsToRemove,
        "filePathsToRemove ============================="
      );
      filePaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${filePath}`, err);
            } else {
              console.log(`File deleted: ${filePath}`);
            }
          });
        }
      });
    };

    // Collect all file paths to be removed
    let filePathsToRemove = [];

    if (ShortDescImagesUrls) {
      filePathsToRemove = filePathsToRemove.concat(
        JSON.parse(ShortDescImagesUrls).map((url) => {
          const fileName = path.basename(url);
          console.log(fileName, "filename ---------------------------");
          return path.join("uploads/product", fileName);
        })
      );
    }

    // Remove images from DescImagesUrls
    if (DescImagesUrls) {
      filePathsToRemove = filePathsToRemove.concat(
        JSON.parse(DescImagesUrls).map((url) => {
          const fileName = path.basename(url);
          return path.join("uploads/product", fileName);
        })
      );
    }
    if (thumbnail) {
      filePathsToRemove.push(path.join("uploads/product", thumbnail));
    }

    // Remove product images
    if (images.length > 0) {
      filePathsToRemove = filePathsToRemove.concat(
        images.map((image) => path.join("uploads/product", image))
      );
    }
    removeFiles(filePathsToRemove);

    console.error("Error updating product:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the product",
      error,
    });
  }
};

exports.editProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const { status } = req.body;

    if (![1, 2, 0].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value.",
      });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    product.status = status;
    product.featureProduct = status !== 1 ? 0 : product.featureProduct;
    const updatedProduct = await product.save();

    res.status(200).json({
      status: true,
      message: "Product status updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the product status",
      error,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId)
      .populate({
        path: "categories",
      })
      .populate({
        path: "createdby",
        select: "-password",
      })
      .populate({
        path: "updatedby",
        select: "-password",
      })
      .populate({
        path: "reviews.user",
        select: "-password",
      });
    //   .populate("reviews.user", "firstname lastname username email");

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the product",
      error,
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    // Access the uploaded file details
    const files = req.files;

    // if (!files || files.length === 0) {
    //   return res.status(400).json({ message: "No file uploaded" });
    // }

    // Construct the URL for accessing the uploaded image
    // const imageUrl = `${req.protocol}://${req.get("host")}/${file.path}`;
    const fileUrls = files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/product/${
        file.filename
      }`;
    });

    // Respond with the URL of the uploaded image
    res
      .status(200)
      .json({ status: true, message: "files uploaded", urls: fileUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};

    if (req.query.options) {
      query = req.query.options;
    }

    const results = await pagination(
      Product,
      Product.find(query)
        .populate({
          path: "categories",
        })
        .populate({
          path: "createdby",
          select: "-password",
        })
        .populate({
          path: "updatedby",
          select: "-password",
        })
        .sort({ createdAt: -1 }),
      // .populate("reviews.user", "firstname lastname username email"),
      { page, limit }
    );

    res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching products",
      error,
    });
  }
};

// Get products by category with pagination
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await pagination(
      Product,
      Product.find({ categories: categoryId })
        .populate({
          path: "categories",
        })
        .populate({
          path: "createdby",
          select: "-password",
        })
        .populate({
          path: "updatedby",
          select: "-password",
        })
        .sort({ createdAt: -1 }),
      // .populate("reviews.user", "firstname lastname username email"),
      { page, limit }
    );

    res.status(200).json({
      status: true,
      message: "Products fetched successfully by category",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching products by category",
      error,
    });
  }
};

// lazyloader
exports.getAllProductsWtLazyLoad = async (req, res) => {
  try {
    const { range, sortby, search } = req.body.filters;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const { categoryId } = req.params;

    let sortOption = {};

    if (sortby === "Low to High") {
      sortOption = { price: 1 }; // Ascending order
    } else if (sortby === "High to Low") {
      sortOption = { price: -1 }; // Descending order
    } else {
      sortOption = { createdAt: -1 }; // Default sorting by creation date
    }

    let query = {};

    if (range.length > 0) {
      query.price = { $gte: range[0], $lte: range[1] };
    }

    if (categoryId) {
      query.categories = { $in: [categoryId] };
    }

    // Conditionally add search criteria
    if (search && search.trim() !== "" && !categoryId) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { "categories.name": { $regex: search, $options: "i" } },
      ];
    } else if (search && search.trim() !== "" && categoryId) {
      query.$or = [{ productName: { $regex: search, $options: "i" } }];
    }

    console.log("Offset:", offset, "Limit:", limit);
    console.log("Query:", JSON.stringify(query));
    console.log("///////////////////////////");

    const products = await Product.find(query)
      .populate({
        path: "categories",
        match:
          search && search.trim() !== ""
            ? { name: { $regex: search, $options: "i" } }
            : {},
      })
      .populate({
        path: "createdby",
        select: "-password",
      })
      .populate({
        path: "updatedby",
        select: "-password",
      })
      .sort(sortOption)
      .skip(offset)
      .limit(limit);
    console.log(products, "products");

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products,
      total: totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
};

// Add a review to a product
exports.addReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { userId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    // Check if the user has already reviewed the product
    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (existingReview) {
      return res.status(400).json({
        status: false,
        message: "You have already reviewed this product",
      });
    }

    // Add the new review
    product.reviews.push({ user: userId, rating, comment });

    // Calculate the new average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = (totalRating / product.reviews.length).toFixed(1);
      product.totalRating = parseFloat(averageRating);
    } else {
      product.totalRating = 0;
    }

    const saved = await product.save();

    const latestReview = saved.reviews[saved.reviews.length - 1];

    res.status(200).json({
      status: true,
      message: "Review added successfully",
      data: { product, latestReview },
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding review",
      error,
    });
  }
};

// Edit a review of a product
exports.editReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    // Find the review by ID
    const reviewToUpdate = product.reviews.find(
      (review) => review._id.toString() === reviewId.toString()
    );
    if (!reviewToUpdate) {
      return res.status(404).json({
        status: false,
        message: "Review not found",
      });
    }

    // Update the review
    reviewToUpdate.rating = rating ? rating : reviewToUpdate.rating;
    reviewToUpdate.comment = comment;
    await product.save();

    // Recalculate the average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = (totalRating / product.reviews.length).toFixed(1);
      product.totalRating = parseFloat(averageRating);
    } else {
      product.totalRating = 0;
    }
    await product.save();

    res.status(200).json({
      status: true,
      message: "Review updated successfully",
      data: { product, reviewToUpdate },
    });
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while editing review",
      error,
    });
  }
};

// Remove a review from a product
exports.removeReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviewId = req.params.reviewId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    // Filter out the review to remove
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId.toString()
    );

    await product.save();

    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = (totalRating / product.reviews.length).toFixed(1);
      product.totalRating = parseFloat(averageRating);
    } else {
      product.totalRating = 0;
    }

    const savedproduct = await product.save();

    res.status(200).json({
      status: true,
      message: "Review removed successfully",
      data: { savedproduct, reviews: savedproduct.reviews },
    });
  } catch (error) {
    console.error("Error removing review:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while removing review",
      error,
    });
  }
};

exports.getAllProductsWtLazyLoadMultiple = async (req, res) => {
  try {
    let range = [];
    let sortby = "";
    // const { range, sortby } = req?.body?.filters;

    if (req?.body?.filters) {
      range = req?.body?.filters.range ? req?.body?.filters.range : [];
      sortby = req?.body?.filters.sortby ? req?.body?.filters.sortby : "";
    }

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const { categories } = req.body;
    console.log(req.body.filters, "=== req.body.filters");

    // console.log()

    let sortOption = {};

    if (sortby === "Low to High") {
      sortOption = { price: 1 }; // Ascending order
    } else if (sortby === "High to Low") {
      sortOption = { price: -1 }; // Descending order
    } else {
      sortOption = { createdAt: -1 }; // Default sorting by creation date
    }

    let query = {};

    if (range.length > 0) {
      query.price = { $gte: range[0], $lte: range[1] };
    }

    if (categories) {
      query.categories = { $in: categories };
    }

    console.log("Offset:", offset, "categories:", categories);
    console.log("Query:", JSON.stringify(query));
    console.log("///////////////////////////");

    const products = await Product.find(query)
      .populate({
        path: "categories",
      })
      .populate({
        path: "createdby",
        select: "-password",
      })
      .populate({
        path: "updatedby",
        select: "-password",
      })
      .sort(sortOption)
      .skip(offset)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    if (products.length < limit) {
      const remainingCount = limit - products.length;
      const randomProducts = await Product.aggregate([
        { $match: { _id: { $nin: products.map((p) => p._id) } } },
        { $sample: { size: remainingCount } },
      ])
        .lookup({
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        })
        .lookup({
          from: "users",
          localField: "createdby",
          foreignField: "_id",
          as: "createdby",
        })
        .lookup({
          from: "users",
          localField: "updatedby",
          foreignField: "_id",
          as: "updatedby",
        });

      // Adding random products to the existing products
      products.push(...randomProducts);
    }

    res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products,
      total: totalProducts,
    });
  } catch (error) {
    console.error(
      "Error fetching products:",
      error,
      "==================================="
    );
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
};

exports.getFeaturedProductsforhome = async (req, res) => {
  try {
    // Fetch featured categories
    let featuredCategories = await Category.find({ featureCategory: 1 });

    // If less than 3 featured categories, add random categories to make it at least 3
    if (featuredCategories.length < 3) {
      const additionalCategories = await Category.find({
        featureCategory: 0,
        _id: { $nin: featuredCategories.map((cat) => cat._id) },
      }).limit(3 - featuredCategories.length);

      featuredCategories = [...featuredCategories, ...additionalCategories];
    }

    const featuredProducts = [];

    for (const category of featuredCategories) {
      // Fetch featured products in the category
      let categoryProducts = await Product.find({
        categories: category._id,
        featureProduct: 1,
      })
        .populate({
          path: "categories",
        })
        .populate({
          path: "createdby",
          select: "-password",
        })
        .populate({
          path: "updatedby",
          select: "-password",
        });

      // If less than 5 featured products, add random products to make it at least 5
      if (categoryProducts.length < 5) {
        const additionalProducts = await Product.find({
          categories: category._id,
          featureProduct: 0,
          _id: { $nin: categoryProducts.map((prod) => prod._id) },
        })
          .populate({
            path: "categories",
          })
          .populate({
            path: "createdby",
            select: "-password",
          })
          .populate({
            path: "updatedby",
            select: "-password",
          })
          .limit(5 - categoryProducts.length);

        categoryProducts = [...categoryProducts, ...additionalProducts];
      }

      featuredProducts.push({
        category: category,
        products: categoryProducts,
      });
    }

    const featureproductlist = await Product.find({ featureProduct: 1 })
      .populate({
        path: "categories",
      })
      .populate({
        path: "createdby",
        select: "-password",
      })
      .populate({
        path: "updatedby",
        select: "-password",
      });

    res.status(200).json({
      status: true,
      message: "Featured products fetched successfully",
      data: featuredProducts,
      featureproductlist,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching featured products",
      error,
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    // const featuredProducts = await Product.find({ featureProduct: 1 });

    const DBQuery = Product.find({ featureProduct: 1 })
      .populate({
        path: "categories",
      })
      .populate({
        path: "createdby",
        select: "-password",
      })
      .populate({
        path: "updatedby",
        select: "-password",
      })
      .sort({ createdAt: -1 });
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const results = await pagination(Product, DBQuery, limitQuery);

    res.status(200).json({
      status: true,
      message: "Featured products fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching featured products",
      error,
    });
  }
};

exports.getFeaturedProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const DBQuery = Product.find({ categories: categoryId, featureProduct: 1 })
      .populate({
        path: "categories",
      })
      .populate({
        path: "createdby",
        select: "-password",
      })
      .populate({
        path: "updatedby",
        select: "-password",
      })
      .sort({ createdAt: -1 });
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const results = await pagination(Product, DBQuery, limitQuery);

    console.log(results);

    res.status(200).json({
      status: true,
      message: "Featured products for category fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching featured products for category:", error);
    res.status(500).json({
      status: false,
      message:
        "An error occurred while fetching featured products for category",
      error,
    });
  }
};

const notifyUsersOfPriceDrop = async (productId, oldPrice, newPrice) => {
  try {
    const carts = await Cart.find({ "items.product": productId }).populate(
      "user items.product"
    );

    for (const cart of carts) {
      const user = cart.user;
      if (user && user.email) {
        await sendPriceDropEmail(user, cart);
      }
    }
  } catch (error) {
    console.error("Error notifying users of price drop:", error);
  }
};

const sendPriceDropEmail = async (user, cart) => {
  const userEmail = user.email;
  const cartItems = cart.items;
  // console.log(cartItems.map((item, index) => item));
  const subject = "Reminder: Price Drop!";

  let body = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i&display=swap"
      rel="stylesheet"
    />
    <!--<![endif]-->
    <title>Email Template</title>
    <!--[if gte mso 9]>
      <style type="text/css" media="all">
        sup {
          font-size: 100% !important;
        }
      </style>
    <![endif]-->
    <!-- body, html, table, thead, tbody, tr, td, div, a, span { font-family: Arial, sans-serif !important; } -->

    <style type="text/css" media="screen">
      body {
        padding: 0 !important;
        margin: 0 auto !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        background: #f4ecfa;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #ff3f3f;
        text-decoration: none;
      }
      p {
        padding: 0 !important;
        margin: 0 !important;
      }
      img {
        margin: 0 !important;
        -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      .btn-16 a {
        display: block;
        padding: 15px 35px;
        text-decoration: none;
      }
      .btn-20 a {
        display: block;
        padding: 15px 35px;
        text-decoration: none;
      }

      .l-white a {
        color: #ffffff;
      }
      .l-black a {
        color: #282828;
      }
      .l-pink a {
        color: #ff3f3f;
      }
      .l-grey a {
        color: #6e6e6e;
      }
      .l-purple a {
        color: #9128df;
      }

      .gradient {
        /* background: linear-gradient(90deg, #5170ff, #ff66c4); */
        background: #ff3f3f;
      }

      .btn-secondary {
        border-radius: 10px;
        background: linear-gradient(90deg, #5170ff, #ff66c4);
      }

      /* Mobile styles */
      @media only screen and (max-device-width: 480px),
        only screen and (max-width: 480px) {
        .mpx-10 {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .mpx-15 {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        u + .body .gwfw {
          width: 100% !important;
          width: 100vw !important;
        }

        .td,
        .m-shell {
          width: 100% !important;
          min-width: 100% !important;
        }

        .mt-left {
          text-align: left !important;
        }
        .mt-center {
          text-align: center !important;
        }
        .mt-right {
          text-align: right !important;
        }

        .me-left {
          margin-right: auto !important;
        }
        .me-center {
          margin: 0 auto !important;
        }
        .me-right {
          margin-left: auto !important;
        }

        .mh-auto {
          height: auto !important;
        }
        .mw-auto {
          width: auto !important;
        }

        .fluid-img img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }

        .column,
        .column-top,
        .column-dir-top {
          float: left !important;
          width: 100% !important;
          display: block !important;
        }

        .m-hide {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          font-size: 0 !important;
          line-height: 0 !important;
          min-height: 0 !important;
        }
        .m-block {
          display: block !important;
        }

        .mw-15 {
          width: 15px !important;
        }

        .mw-2p {
          width: 2% !important;
        }
        .mw-32p {
          width: 32% !important;
        }
        .mw-49p {
          width: 49% !important;
        }
        .mw-50p {
          width: 50% !important;
        }
        .mw-100p {
          width: 100% !important;
        }

        .mmt-0 {
          margin-top: 0 !important;
        }
      }
    </style>
  </head>
  <body
    class="body"
    style="
      padding: 0 !important;
      margin: 0 auto !important;
      display: block !important;
      min-width: 100% !important;
      width: 100% !important;
      background: #f4ecfa;
      -webkit-text-size-adjust: none;
    "
  >
    <center>
      <table
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="margin: 0; padding: 0; width: 100%; height: 100%"
        bgcolor="#f4ecfa"
        class="gwfw"
      >
        <tr>
          <td
            style="margin: 0; padding: 0; width: 100%; height: 100%"
            align="center"
            valign="top"
          >
            <table
              width="600"
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="m-shell"
            >
              <tr>
                <td
                  class="td"
                  style="
                    width: 600px;
                    min-width: 600px;
                    font-size: 0pt;
                    line-height: 0pt;
                    padding: 0;
                    margin: 0;
                    font-weight: normal;
                  "
                >
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                  >
                    <tr>
                      <td class="mpx-10">
                        <!-- Top -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="text-12 c-grey l-grey a-right py-20"
                              style="
                                font-size: 12px;
                                line-height: 16px;
                                font-family: 'PT Sans', Arial, sans-serif;
                                min-width: auto !important;
                                color: #6e6e6e;
                                text-align: right;
                                padding-top: 20px;
                                padding-bottom: 20px;
                              "
                            >
                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="text-decoration: none; color: #6e6e6e"
                                ></span
                              ></a>
                            </td>
                          </tr>
                        </table>
                        <!-- END Top -->

                        <!-- Container -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="gradient pt-10"
                              style="
                                border-radius: 10px 10px 0 0;
                                padding-top: 10px;
                              "
                              bgcolor="#f3189e"
                            >
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    style="border-radius: 10px 10px 0 0"
                                    bgcolor="#ffffff"
                                  >
                                    <!-- Logo -->
                                    <div
                                      style="
                                        font-size: 15px;
                                        padding: 5px 50px;
                                        display: flex;
                                        gap: 10px;
                                      "
                                    >
                                      <img
                                        style="height: 35px"
                                        src="https://customizehere.in/assets/images/logo/logo.png"
                                        alt=""
                                      />
                                      <h2>Ecom</h2>
                                    </div>
                                    <!-- Logo -->

                                    <!-- Main -->
                                    <table
                                      width="100%"
                                      border="0"
                                      cellspacing="0"
                                      cellpadding="0"
                                    >
                                      <tr>
                                        <td
                                          class="px-50 mpx-15"
                                          style="
                                            padding-left: 50px;
                                            padding-right: 50px;
                                          "
                                        >
                                          <!-- Section - Intro -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-50"
                                                style="padding-bottom: 50px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <hr />
                                                  <tr>
                                                    <td
                                                      class="title-36 a-center pb-15"
                                                      style="
                                                        font-size: 36px;
                                                        line-height: 40px;
                                                        color: #282828;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        text-align: center;
                                                        padding-bottom: 15px;
                                                        padding-top: 15px;
                                                      "
                                                    >
                                                      <strong
                                                        >Price Drop!</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="text-16 lh-26 a-center pb-25"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: center;
                                                        padding-bottom: 25px;
                                                      "
                                                    >
                                                      Hey ${user.firstname},
                                                      great news! Prices just
                                                      dropped on items in your
                                                      cart—don’t miss out on
                                                      these deals before they’re
                                                      gone!
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td align="center">
                                                      <!-- Button -->
                                                      <table
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                        style="min-width: 200px"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="btn-16 c-white l-white"
                                                            bgcolor="#ff3f3f"
                                                            style="
                                                              font-size: 16px;
                                                              line-height: 20px;
                                                              mso-padding-alt: 15px
                                                                35px;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              text-align: center;
                                                              font-weight: bold;
                                                              text-transform: uppercase;
                                                              border-radius: 25px;
                                                              min-width: auto !important;
                                                              color: #ffffff;
                                                            "
                                                          >
                                                            <a
                                                              href="${
                                                                constants.frontUrl
                                                              }login"
                                                              target="_blank"
                                                              class="link c-white"
                                                              style="
                                                                display: block;
                                                                padding: 15px
                                                                  35px;
                                                                text-decoration: none;
                                                                color: #ffffff;
                                                              "
                                                            >
                                                              <span
                                                                class="link c-white"
                                                                style="
                                                                  text-decoration: none;
                                                                  color: #ffffff;
                                                                "
                                                                >Login</span
                                                              >
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                      <!-- END Button -->
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Intro -->

                                          <!-- Section - Separator Line -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-50"
                                                style="padding-bottom: 10px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="img"
                                                      height="1"
                                                      bgcolor="#ebebeb"
                                                      style="
                                                        font-size: 0pt;
                                                        line-height: 0pt;
                                                        text-align: left;
                                                      "
                                                    >
                                                      &nbsp;
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Separator Line -->

                                          <!-- Section - Order Details -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="pb-50"
                                                style="padding-bottom: 50px"
                                              >
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <!-- <div> -->
                                                  <h3
                                                    style="
                                                      font-size: 20px;
                                                      text-align: center;
                                                    "
                                                  >
                                                    Cart Items
                                                  </h3>
                                                  <!-- </div> -->
                                                  <tr>
                                                    <td
                                                      class="py-15"
                                                      style="
                                                        border: 1px solid
                                                          #000001;
                                                        border-left: 0;
                                                        border-right: 0;
                                                        padding-top: 15px;
                                                        padding-bottom: 15px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="title-20 mw-auto"
                                                            width="200"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              text-align: left;
                                                              min-width: auto !important;
                                                            "
                                                          >
                                                            <strong
                                                              >Item</strong
                                                            >
                                                          </td>
                                                          <td
                                                            class="img"
                                                            width="20"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          ></td>
                                                          <td
                                                            class="title-20 a-center mw-auto"
                                                            width="40"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              min-width: auto !important;
                                                              text-align: center;
                                                            "
                                                          >
                                                            <strong>Qty</strong>
                                                          </td>
                                                          <td
                                                            class="img"
                                                            width="20"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              text-align: left;
                                                            "
                                                          ></td>
                                                          <td
                                                            class="title-20 a-right mw-auto"
                                                            style="
                                                              font-size: 20px;
                                                              line-height: 24px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial,
                                                                sans-serif;
                                                              min-width: auto !important;
                                                              text-align: right;
                                                            "
                                                          >
                                                            <strong
                                                              >Price</strong
                                                            >
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <!-- cart Items -->
                                                  ${cartItems.map(
                                                    (item, itemindex) => `
                                                  <tr key="${itemindex}">
                                                    <td
                                                      class="py-25"
                                                      style="
                                                        border-bottom: 1px solid
                                                          #ebebeb;
                                                        padding-top: 25px;
                                                        padding-bottom: 25px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="200"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          >
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 pb-10"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    padding-bottom: 10px;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >${item.product.productName}</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td
                                                                  class="text-16 lh-24"
                                                                  style="
                                                                    font-size: 16px;
                                                                    color: #6e6e6e;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: left;
                                                                    min-width: auto !important;
                                                                    line-height: 24px;
                                                                  "
                                                                ></td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="20"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            width="40"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          >
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 a-center mt-left"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    min-width: auto !important;
                                                                    text-align: center;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >&times;${item.quantity}</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                          <th
                                                            class="column-top mpb-15"
                                                            valign="top"
                                                            width="20"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          ></th>
                                                          <th
                                                            class="column-top"
                                                            valign="top"
                                                            style="
                                                              font-size: 0pt;
                                                              line-height: 0pt;
                                                              padding: 0;
                                                              margin: 0;
                                                              font-weight: normal;
                                                              vertical-align: top;
                                                            "
                                                          >
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="title-20 a-right mt-left"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    color: #282828;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    min-width: auto !important;
                                                                    text-align: right;
                                                                  "
                                                                >
                                                                  <strong
                                                                    >₹${item.product.price}</strong
                                                                  >
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </th>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  `
                                                  )}
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Section - Order Details -->
                                        </td>
                                      </tr>
                                    </table>
                                    <!-- END Main -->
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- END Container -->

                        <!-- Footer -->
                        <!-- Footer -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="p-50 mpx-15"
                              bgcolor="#000000"
                              style="
                                border-radius: 0 0 10px 10px;
                                padding: 50px;
                              "
                            >
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    class="text-14 lh-24 a-center c-white l-white pb-20"
                                    style="
                                      font-size: 14px;
                                      font-family: 'PT Sans', Arial, sans-serif;
                                      min-width: auto !important;
                                      line-height: 24px;
                                      text-align: center;
                                      color: #ffffff;
                                      padding-bottom: 20px;
                                    "
                                  >
                                    Address :${constants.address}
                                    <br />
                                    <a
                                      href="tel:+17384796719"
                                      target="_blank"
                                      class="link c-white"
                                      style="
                                        text-decoration: none;
                                        color: #ffffff;
                                      "
                                      ><span
                                        class="link c-white"
                                        style="
                                          text-decoration: none;
                                          color: #ffffff;
                                        "
                                      >
                                        Phn. : ${constants.phone}</span
                                      ></a
                                    >
                                    <br />
                                    <a
                                      href="mailto:info@website.com"
                                      target="_blank"
                                      class="link c-white"
                                      style="
                                        text-decoration: none;
                                        color: #ffffff;
                                      "
                                      ><span
                                        class="link c-white"
                                        style="
                                          text-decoration: none;
                                          color: #ffffff;
                                        "
                                      >
                                        ${constants.contactemail}</span
                                      ></a
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- END Footer -->

                        <!-- Bottom -->
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td
                              class="text-12 lh-22 a-center c-grey- l-grey py-20"
                              style="
                                font-size: 12px;
                                color: #6e6e6e;
                                font-family: 'PT Sans', Arial, sans-serif;
                                min-width: auto !important;
                                line-height: 22px;
                                text-align: center;
                                padding-top: 20px;
                                padding-bottom: 20px;
                              "
                            >
                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>

                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>

                              <a
                                href="#"
                                target="_blank"
                                class="link c-grey"
                                style="text-decoration: none; color: #6e6e6e"
                                ><span
                                  class="link c-grey"
                                  style="
                                    white-space: nowrap;
                                    text-decoration: none;
                                    color: #6e6e6e;
                                  "
                                ></span
                              ></a>
                            </td>
                          </tr>
                        </table>
                        <!-- END Bottom -->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;

  const mailOptions = {
    from: constants.adminEmail,
    to: userEmail,
    subject: subject,
    html: body,
  };

  await transporter.sendMail(mailOptions);
};
