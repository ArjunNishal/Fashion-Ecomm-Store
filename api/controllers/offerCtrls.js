const Offer = require("../models/offersSchema");

// Get all offers
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate("createdby", "-password");
    res.status(200).json({
      status: true,
      message: "Offers fetched successfully!",
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch offers",
      error: error.message,
    });
  }
};

// Add a new offer
exports.addOffer = async (req, res) => {
  try {
    const { name, description, number } = req.body;

    const parsenum = parseInt(number, 10);

    const existing = await Offer.findOne({ number: parsenum });

    if (existing) {
      return res.status(500).send({
        status: false,
        message: "Offer with same S. No. already exists.",
      });
    }

    const newOffer = new Offer({
      name,
      number: parsenum,
      description,
      createdby: req.user,
    });

    const savedOffer = await newOffer.save();

    res.status(201).json({
      status: true,
      message: "Offer created successfully!",
      data: savedOffer,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to create offer",
      error: error.message,
    });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOffer = await Offer.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.status(404).json({
        status: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Offer deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to delete offer",
      error: error.message,
    });
  }
};

const Coupon = require("../models/couponsSchema");

// Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate("createdby", "-password");
    res.status(200).json({
      status: true,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching coupons",
    });
  }
};

exports.getCouponByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ status: false, message: "Invalid coupon" });
    }

    res.status(200).json({ status: true, data: coupon });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Add a new coupon
exports.addCoupon = async (req, res) => {
  try {
    const { name, discount, code } = req.body;

    const newCoupon = new Coupon({
      name,
      discount: parseInt(discount, 10),
      code,
      createdby: req.user,
    });

    const savedCoupon = await newCoupon.save();

    res.status(201).json({
      status: true,
      message: "Coupon created successfully!",
      data: savedCoupon,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error creating coupon",
    });
  }
};

// Delete a coupon by ID
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        status: false,
        message: "Coupon not found",
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting coupon",
    });
  }
};
