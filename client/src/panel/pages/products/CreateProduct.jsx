import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import BreadcrumbPanel from "../../components/BreadcrumbPanel";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, renderUrl } from "../../../config";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sidebarlinks } from "../../components/dashboardconfig";
import Select from "react-select";
import CkeditorComponent from "../../components/CkeditorComponent";
import Swal from "sweetalert2";

const CreateProduct = () => {
  const token = localStorage.getItem("admin");
  const decoded = jwtDecode(token);
  const [loading, setloading] = useState(false);

  const [ShortDescriptionContent, setShortDescriptionContent] = useState("");
  const [ShortDescImages, setShortDescImages] = useState([]);

  const [DescriptionContent, setDescriptionContent] = useState("");
  const [DescImages, setDescImages] = useState([]);

  const [CategoriesOptions, setCategoriesOptions] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`panel/cat/get/allcategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const cats = response.data.data.map((cat) => ({
        value: cat._id,
        label: cat.name,
      }));

      setCategoriesOptions(cats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [productForm, setproductForm] = useState({
    productName: "",
    quantity: "",
    type: "",
    categories: [],
    price: "",
    actualPrice: "",
    discount: "",
    products: [
      {
        productName: "",
        sizes: [{ shortform: "", fullform: "" }],
        colors: [{ name: "", code: "" }],
      },
    ],
    thumbnail: null,
    images: [],
    note: "",
    shortDescription: "",
    description: "",
    featureProduct: 0,
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      decoded.role !== "superadmin" &&
      !decoded.permissions.includes("Add Products")
    ) {
      alert("You are not authorised to see this page");
      navigate("/panel_dashboard");
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 320px)" : "calc(100% - 95px)";

  // add product functions============================================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === ("quantity" || "price" || "actualPrice" || "discount")) {
      // let inputMobileNo = e.target.value;
      let inputMobileNo = e.target.value.replace(/\D/g, "");
      setproductForm({
        ...productForm,
        [e.target.name]: inputMobileNo,
      });
    } else {
      setproductForm((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const [formchanged, setformchanged] = useState(false);

  useEffect(() => {
    console.log(productForm, "productform");

    if (formchanged === true) {
      validateForm();
    }
  }, [productForm]);
  console.log(productForm.type, "productForm.type");
  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    if (name === "type") {
      if (
        selectedOption.value === "single" &&
        productForm.products.length > 1
      ) {
        Swal.fire({
          title: "Warning",
          text: "There should be only one item in the items list for a single type product. Please remove extra items.",
          icon: "warning",
        });
        setproductForm((prevState) => ({
          ...prevState,
          [name]: "combo",
        }));
      } else {
        setformchanged(true);
        setproductForm((prevState) => ({
          ...prevState,
          [name]: selectedOption.value,
        }));
      }
    } else {
      setformchanged(true);
      setproductForm((prevState) => ({ ...prevState, [name]: selectedOption }));
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...productForm.products];
    setformchanged(true);
    items[index][name] = value;
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  useEffect(() => {
    const name = "shortdescription";
    handleDescriptionChange(name);
    if (ShortDescriptionContent !== "") {
      setformchanged(true);
    }
  }, [ShortDescriptionContent]);

  useEffect(() => {
    const name = "description";
    handleDescriptionChange(name);
    if (DescriptionContent !== "") {
      setformchanged(true);
    }
  }, [DescriptionContent]);

  const handleDescriptionChange = (name) => {
    if (name === "shortdescription") {
      setproductForm((prevState) => ({
        ...prevState,
        shortDescription: ShortDescriptionContent,
      }));
    } else {
      setproductForm((prevState) => ({
        ...prevState,
        description: DescriptionContent,
      }));
    }
  };

  const handleSizeChange = (itemIndex, sizeIndex, e) => {
    const { name, value } = e.target;
    const items = [...productForm.products];
    setformchanged(true);
    items[itemIndex].sizes[sizeIndex][name] = value;
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  const handleColorChange = (itemIndex, colorIndex, e) => {
    const { name, value } = e.target;
    const items = [...productForm.products];
    items[itemIndex].colors[colorIndex][name] = value;
    setformchanged(true);
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  const addItem = () => {
    setproductForm((prevState) => ({
      ...prevState,
      products: [
        ...prevState.products,
        {
          itemName: "",
          sizes: [{ shortform: "", fullform: "" }],
          colors: [{ name: "", code: "" }],
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const items = productForm.products;
    items.splice(index, 1);
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  const addSize = (itemIndex) => {
    const items = [...productForm.products];
    items[itemIndex].sizes.push({ shortform: "", fullform: "" });
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  const removeSize = (itemIndex, sizeIndex) => {
    const items = [...productForm.products];
    items[itemIndex].sizes.splice(sizeIndex, 1);
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  const addColor = (itemIndex) => {
    const items = [...productForm.products];
    items[itemIndex].colors.push({ name: "", code: "" });
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  const removeColor = (itemIndex, colorIndex) => {
    const items = [...productForm.products];
    items[itemIndex].colors.splice(colorIndex, 1);
    setproductForm((prevState) => ({ ...prevState, items }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setformchanged(true);
    if (name === "thumbnail") {
      setproductForm((prevState) => ({ ...prevState, thumbnail: files[0] }));
    } else {
      setproductForm((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...files],
      }));
    }
  };

  const removeImage = (index) => {
    const images = [...productForm.images];
    images.splice(index, 1);
    setproductForm((prevState) => ({ ...prevState, images }));
  };

  const validateForm = () => {
    const errors = {};

    // Validate product details
    if (!productForm.productName)
      errors.productName = "Product Name is required";
    if (!productForm.quantity) errors.quantity = "Quantity is required";
    if (!productForm.type) errors.type = "Type is required";
    if (!productForm.price) errors.price = "Price is required";
    if (!productForm.actualPrice)
      errors.actualPrice = "Actual Price is required";
    if (!productForm.discount) errors.discount = "Discount is required";

    // Validate categories
    if (productForm.categories.length === 0)
      errors.categories = "At least one category is required";

    // Validate products
    if (productForm.products.length === 0)
      errors.products = "At least one product is required";
    productForm.products.forEach((product, index) => {
      if (!product.productName)
        errors[`products[${index}].productName`] = "Product Name is required";

      // Validate sizes
      if (product.sizes.length === 0)
        errors[`products[${index}].sizes`] = "At least one size is required";
      product.sizes.forEach((size, sizeIndex) => {
        if (!size.shortform)
          errors[`products[${index}].sizes[${sizeIndex}].shortform`] =
            "Short Form is required";
        if (!size.fullform)
          errors[`products[${index}].sizes[${sizeIndex}].fullform`] =
            "Full Form is required";
      });

      // Validate colors
      if (product.colors.length === 0)
        errors[`products[${index}].colors`] = "At least one color is required";
      product.colors.forEach((color, colorIndex) => {
        if (!color.name)
          errors[`products[${index}].colors[${colorIndex}].name`] =
            "Color Name is required";
        if (!color.code)
          errors[`products[${index}].colors[${colorIndex}].code`] =
            "Color Code is required";
      });
    });

    // Validate thumbnail
    if (!productForm.thumbnail) errors.thumbnail = "Thumbnail is required";

    // Validate product images
    if (productForm.images.length === 0)
      errors.images = "At least one product image is required";

    // Validate note
    if (!productForm.note) errors.note = "Note is required";

    // Validate short description
    if (!productForm.shortDescription)
      errors.shortDescription = "Short Description is required";

    // Validate description
    if (!productForm.description)
      errors.description = "Description is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  console.log(errors);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const uploadImages = async (imagesArray, endpoint) => {
        try {
          const formData = new FormData();
          imagesArray.forEach((image, index) => {
            formData.append("files", image);
          });
          const response = await axiosInstance.post(endpoint, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data.urls;
        } catch (error) {
          console.log(error);
        }
      };

      const ShortDescImagesUrls = await uploadImages(
        ShortDescImages,
        "panel/product/upload/image"
      );
      const DescImagesUrls = await uploadImages(
        DescImages,
        "panel/product/upload/image"
      );

      const formData = new FormData();
      formData.append(
        "ShortDescImagesUrls",
        JSON.stringify(ShortDescImagesUrls)
      );
      formData.append("DescImagesUrls", JSON.stringify(DescImagesUrls));

      formData.append("productName", productForm.productName);

      formData.append("quantity", productForm.quantity);
      formData.append("type", productForm.type);
      formData.append("price", productForm.price);
      formData.append("actualPrice", productForm.actualPrice);
      formData.append("discount", productForm.discount);
      formData.append(
        "categories",
        JSON.stringify(productForm.categories.map((c) => c.value))
      );
      formData.append("products", JSON.stringify(productForm.products));
      formData.append("note", productForm.note);
      formData.append("shortDescription", ShortDescriptionContent);
      formData.append("description", DescriptionContent);
      formData.append("featureProduct", productForm.featureProduct);
      if (productForm.thumbnail)
        formData.append("thumbnail", productForm.thumbnail);
      productForm.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      try {
        setloading(true);
        const res = await axiosInstance.post(
          "panel/product/createproduct",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setloading(false);
        // alert("Product created successfully");
        navigate("/panel_products");
        Swal.fire("Success", res.data.message, "success");
      } catch (error) {
        setloading(false);
        console.log(error);
        // alert("Error creating product");
        Swal.fire("Error", error.response.data.message, "error");
      }
    }
  };
  const typeOptions = [
    { value: "single", label: "Single Product" },
    { value: "combo", label: "Combo Product" },
  ];

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ========= right pane =========*/}
      <div
        className={`main dashboard-main container-fluid ${
          isOpen ? "open" : ""
        }`}
        style={{ right: "0px" }}
        id="upload-div"
      >
        {/* =========topbar ========= */}
        <Topbar />

        <div className=" mt-md-2  mt-0">
          <BreadcrumbPanel
            breadlinks={[
              {
                url: "/panel_dashboard",
                text: "Home",
              },
              {
                url: "/panel_products",
                text: "Products",
              },
              {
                url: "/panel_createproduct",
                text: "Create Product",
              },
            ]}
          />
          <div className="admin_main container-fluid">
            <div className="create_product_form_main">
              <div className="card border-0 shadow">
                <div className="card-header">
                  <h6 className="m-0">Create New Product</h6>
                </div>
                <div className="card-body">
                  <div className="create_product_form">
                    <form onSubmit={handleSubmit}>
                      <div className="row mx-0">
                        <div className=" col-12 ">
                          <div className="mb-3">
                            <label className="form-label">Categories</label>
                            <Select
                              isMulti
                              name="categories"
                              options={CategoriesOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              value={productForm.categories}
                              onChange={handleSelectChange}
                            />
                            {errors.categories && (
                              <div className="text-danger invalid-font">
                                {errors.categories}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Product Name</label>
                            <input
                              placeholder="Product Name"
                              type="text"
                              name="productName"
                              value={productForm.productName}
                              required
                              onChange={handleInputChange}
                              className={`form-control ${
                                errors.productName ? "is-invalid" : ""
                              }`}
                            />{" "}
                            {errors.productName && (
                              <div className="invalid-feedback">
                                {errors.productName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Quantity</label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.quantity ? "is-invalid" : ""
                              }`}
                              id="quantity"
                              name="quantity"
                              placeholder="quantity"
                              value={productForm.quantity}
                              onChange={handleInputChange}
                              required
                            />
                            {errors.quantity && (
                              <div className="invalid-feedback">
                                {errors.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Type</label>
                            <Select
                              name="type"
                              onChange={handleSelectChange}
                              label={productForm.type}
                              placeholder="Select..."
                              // value={productForm.type}
                              value={typeOptions.find(
                                (option) => option.value === productForm.type
                              )}
                              options={typeOptions}
                            />
                            {errors.type && (
                              <div className="text-danger invalid-font">
                                {errors.type}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Price (Discounted Price)
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.price ? "is-invalid" : ""
                              }`}
                              id="price"
                              name="price"
                              placeholder="Discounted Price"
                              value={productForm.price}
                              onChange={handleInputChange}
                              required
                            />
                            {errors.price && (
                              <div className="invalid-feedback">
                                {errors.price}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Actual Price</label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.actualPrice ? "is-invalid" : ""
                              }`}
                              id="actualPrice"
                              name="actualPrice"
                              value={productForm.actualPrice}
                              onChange={handleInputChange}
                              placeholder="Actual Price"
                              required
                            />
                            {errors.actualPrice && (
                              <div className="invalid-feedback">
                                {errors.actualPrice}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Discount %age</label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.discount ? "is-invalid" : ""
                              }`}
                              id="discount"
                              name="discount"
                              value={productForm.discount}
                              placeholder="Discount"
                              onChange={handleInputChange}
                              required
                            />
                            {errors.discount && (
                              <div className="invalid-feedback">
                                {errors.discount}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-12 col-md-6">
                          <div className="mb-3">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                checked={productForm.featureProduct === 1}
                                className="custom-control-input"
                                id="customSwitch1"
                                onChange={(e) => {
                                  console.log(e.target.checked);
                                  setproductForm({
                                    ...productForm,
                                    featureProduct:
                                      e.target.checked === true ? 1 : 0,
                                  });
                                }}
                              />
                              <label
                                className="custom-control-label check_label"
                                htmlFor="customSwitch1"
                              >
                                <b> Add to Feature Products</b>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <hr />
                          <p>
                            <b>Items</b>
                          </p>
                        </div>
                        {/* products */}
                        <div className="col-12">
                          {productForm?.products?.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="product_box_product_form card px-m-0 mb-2 card-body"
                            >
                              <div className="row mx-0">
                                <div className="col-6">
                                  <small>
                                    <b className="text-panel">
                                      Item {itemIndex + 1}
                                    </b>
                                  </small>
                                </div>
                                {productForm?.products?.length > 1 && (
                                  <div className="col-6">
                                    <div className="text-right">
                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeItem(itemIndex)}
                                      >
                                        <i className="fas fa-trash"></i> Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
                                <div className="col-md-7 col-12 mb-3">
                                  <label className="form-label">
                                    Name of Item
                                  </label>
                                  <input
                                    className={`form-control ${
                                      errors[
                                        `products[${itemIndex}].productName`
                                      ]
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="Name of Item"
                                    type="text"
                                    name="productName"
                                    value={item.productName}
                                    required
                                    onChange={(e) =>
                                      handleItemChange(itemIndex, e)
                                    }
                                  />
                                  {errors[
                                    `products[${itemIndex}].productName`
                                  ] && (
                                    <div className="invalid-feedback">
                                      {
                                        errors[
                                          `products[${itemIndex}].productName`
                                        ]
                                      }
                                    </div>
                                  )}
                                </div>
                                <div className="col-xl-6 col-12">
                                  <div className="sizes_box">
                                    <p>
                                      <small>
                                        <b className="form-label">Size Chart</b>
                                      </small>
                                    </p>
                                    <div className="sizes_chart_list">
                                      {item.sizes.map((size, sizeIndex) => (
                                        <div
                                          key={sizeIndex}
                                          className="row mx-0 mb-2 border py-1 rounded"
                                        >
                                          <div className="col-md-5 col-12 mb-md-0 mb-2 px-m-1">
                                            <input
                                              type="text"
                                              name="shortform"
                                              value={size.shortform}
                                              className={`form-control ${
                                                errors[
                                                  `products[${itemIndex}].sizes[${sizeIndex}].shortform`
                                                ]
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                              // products[${index}].sizes[${sizeIndex}].shortform
                                              required
                                              placeholder="Shortform (S,M,L,XL)"
                                              onChange={(e) =>
                                                handleSizeChange(
                                                  itemIndex,
                                                  sizeIndex,
                                                  e
                                                )
                                              }
                                            />
                                            {errors[
                                              `products[${itemIndex}].sizes[${sizeIndex}].shortform`
                                            ] && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors[
                                                    `products[${itemIndex}].sizes[${sizeIndex}].shortform`
                                                  ]
                                                }
                                              </div>
                                            )}
                                          </div>
                                          <div className="col-md-5 col-12 mb-md-0 mb-2 px-m-1">
                                            <input
                                              type="text"
                                              className={`form-control ${
                                                errors[
                                                  `products[${itemIndex}].sizes[${sizeIndex}].fullform`
                                                ]
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                              name="fullform"
                                              value={size.fullform}
                                              required
                                              placeholder="FullForm (Small,Medium)"
                                              onChange={(e) =>
                                                handleSizeChange(
                                                  itemIndex,
                                                  sizeIndex,
                                                  e
                                                )
                                              }
                                            />
                                            {errors[
                                              `products[${itemIndex}].sizes[${sizeIndex}].fullform`
                                            ] && (
                                              <div className="invalid-feedback">
                                                {
                                                  errors[
                                                    `products[${itemIndex}].sizes[${sizeIndex}].fullform`
                                                  ]
                                                }
                                              </div>
                                            )}
                                          </div>
                                          <div className="col-md-2 col-12 mb-md-0 mb-2 p-md-0 text-md-center text-right">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeSize(itemIndex, sizeIndex)
                                              }
                                              className="btn btn-danger"
                                            >
                                              <i className="fas fa-trash"></i>
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      <div className="text-center">
                                        <button
                                          type="button"
                                          className="btn btn-success mb-3"
                                          onClick={() => addSize(itemIndex)}
                                        >
                                          <i className="fas fa-plus"></i> Add
                                          Size
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <div className="sizes_box">
                                    <p>
                                      <small>
                                        <b className="form-label">Colors</b>
                                      </small>
                                    </p>
                                    <div className="sizes_chart_list">
                                      {item?.colors?.map(
                                        (color, colorIndex) => (
                                          <div className="row mx-0 mb-2 border py-1 rounded">
                                            <div className="col-md-5 col-12 mb-md-0 mb-2 px-m-1">
                                              <div className="input-group">
                                                <div className="input-group-prepend">
                                                  <span
                                                    className="input-group-text"
                                                    id="basic-addon1"
                                                  >
                                                    {color?.code ||
                                                      "Color Code"}
                                                  </span>
                                                </div>
                                                <input
                                                  type="color"
                                                  className={`form-control ${
                                                    errors[
                                                      `products[${itemIndex}].colors[${colorIndex}].code`
                                                    ]
                                                      ? "is-invalid"
                                                      : ""
                                                  }`}
                                                  value={color.code}
                                                  name="code"
                                                  required
                                                  onChange={(e) =>
                                                    handleColorChange(
                                                      itemIndex,
                                                      colorIndex,
                                                      e
                                                    )
                                                  }
                                                  placeholder=""
                                                />{" "}
                                              </div>
                                              {errors[
                                                `products[${itemIndex}].colors[${colorIndex}].code`
                                              ] && (
                                                <div className="invalid-feedback">
                                                  {
                                                    errors[
                                                      `products[${itemIndex}].colors[${colorIndex}].code`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                            </div>
                                            <div className="col-md-5 col-12 mb-md-0 mb-2 px-m-1">
                                              <input
                                                type="text"
                                                className={`form-control ${
                                                  errors[
                                                    `products[${itemIndex}].colors[${colorIndex}].name`
                                                  ]
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                placeholder="Color Name"
                                                name="name"
                                                required
                                                value={color.name}
                                                onChange={(e) =>
                                                  handleColorChange(
                                                    itemIndex,
                                                    colorIndex,
                                                    e
                                                  )
                                                }
                                              />{" "}
                                              {errors[
                                                `products[${itemIndex}].colors[${colorIndex}].name`
                                              ] && (
                                                <div className="invalid-feedback">
                                                  {
                                                    errors[
                                                      `products[${itemIndex}].colors[${colorIndex}].name`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                            </div>
                                            <div className="col-md-2 col-12 mb-md-0 mb-2 p-md-0 text-md-center text-right">
                                              <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() =>
                                                  removeColor(
                                                    itemIndex,
                                                    colorIndex
                                                  )
                                                }
                                              >
                                                <i className="fas fa-trash"></i>
                                              </button>
                                            </div>
                                          </div>
                                        )
                                      )}
                                      <div className="text-center">
                                        <button
                                          type="button"
                                          className="btn btn-success mb-3"
                                          onClick={() => addColor(itemIndex)}
                                        >
                                          <i className="fas fa-plus"></i> Add
                                          Color
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {productForm.type === "combo" && (
                            <div className="col-12">
                              <div className="text-center py-2">
                                <button
                                  type="button"
                                  onClick={() => addItem()}
                                  className="btn btn-primary"
                                >
                                  <i className="fas fa-plus"></i> Add Item
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* images */}
                        <div className="col-12">
                          <hr />
                          <p>
                            <b>Product Images</b>
                          </p>
                        </div>
                        <div className="col-12">
                          <div className="product_images_main_box">
                            <div className="row mx-0">
                              <div className="col-md-6 col-12">
                                <div className="mb-3">
                                  <label className="form-label">
                                    Thumbnail
                                  </label>
                                  <div className="custom-file">
                                    <input
                                      type="file"
                                      // ref={fileInputRef}

                                      name="thumbnail"
                                      onChange={handleFileChange}
                                      accept="image/*"
                                      className="custom-file-input"
                                      id="customFile"
                                      required
                                    />
                                    <label
                                      className="custom-file-label overflow-hidden"
                                      htmlFor="customFile"
                                    >
                                      {/* choose file */}
                                      {productForm?.thumbnail
                                        ? productForm?.thumbnail?.name
                                        : "Choose file"}
                                    </label>
                                  </div>
                                  {errors.thumbnail && (
                                    <div className="text-danger invalid-font">
                                      {errors.thumbnail}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-6 col-12">
                                <div className="mb-3">
                                  <div className="product_selected_thumbnail">
                                    {productForm?.thumbnail && (
                                      <img
                                        src={URL.createObjectURL(
                                          productForm?.thumbnail
                                        )}
                                        alt="thumbnail"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                    Product Images
                                  </label>
                                  <div className="custom-file">
                                    <input
                                      type="file"
                                      // ref={fileInputRef}
                                      name="images"
                                      multiple
                                      onChange={handleFileChange}
                                      accept="image/*"
                                      className="custom-file-input"
                                      id="customFile"
                                      required
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="customFile"
                                    >
                                      {/* choose file */}
                                      {productForm?.images &&
                                      productForm?.images?.length > 0
                                        ? `${productForm?.images?.length} files selected`
                                        : "Choose file"}
                                    </label>
                                  </div>
                                  {errors.images && (
                                    <div className="text-danger invalid-font">
                                      {errors.images}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="product_images_row">
                                  <div className="d-flex flex-wrap">
                                    {productForm?.images?.map(
                                      (image, index) => (
                                        <div
                                          key={index}
                                          className="product_image_panel"
                                        >
                                          <img
                                            src={URL.createObjectURL(image)}
                                            alt="img"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="btn remove_img_btn p-0 border-0 shadow-0"
                                          >
                                            <i className="fas fa-times"></i>
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* about product */}
                        <div className="col-12">
                          <hr />
                          <div className="mb-3">
                            <label className="form-label" htmlFor="note">
                              Note
                            </label>
                            <textarea
                              className={`form-control ${
                                errors.note ? "is-invalid" : ""
                              }`}
                              id="note"
                              name="note"
                              value={productForm.note}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                            {errors.note && (
                              <div className="invalid-feedback">
                                {errors.note}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Short Description
                            </label>
                            <CkeditorComponent
                              content={ShortDescriptionContent}
                              setcontent={setShortDescriptionContent}
                              setuploadedImagesarr={setShortDescImages}
                              uploadedImagesarr={ShortDescImages}
                            />
                            {errors.shortDescription && (
                              <div className="text-danger invalid-font">
                                {errors.shortDescription}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">Description</label>
                            <CkeditorComponent
                              content={DescriptionContent}
                              setcontent={setDescriptionContent}
                              uploadedImagesarr={DescImages}
                              setuploadedImagesarr={setDescImages}
                            />{" "}
                            {errors.description && (
                              <div className="text-danger invalid-font">
                                {errors.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="text-center">
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg"
                            >
                              {!loading ? "Create New Product" : "Creating..."}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ============================ bottom ================ */}
        <Footer />
      </div>
    </>
  );
};

export default CreateProduct;
