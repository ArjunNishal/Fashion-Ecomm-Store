const Subscriber = require("../models/newslettersubsSchema");
const { pagination } = require("./pagination");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email already exists
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "Email is already subscribed." });
    }

    // Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({
      status: true,
      message: "Subscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const { subscribed } = req.body;

    // Find the subscriber by email
    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { subscribed },
      { new: true }
    );

    if (!subscriber) {
      return res
        .status(404)
        .json({ status: false, message: "Subscriber not found." });
    }

    res.status(200).json({
      status: true,
      message: "Subscription status updated",
      data: subscriber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    // const subscribers = await Subscriber.find();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await pagination(
      Subscriber,
      Subscriber.find().sort({ createdAt: -1 }),
      { page, limit }
    );

    res.status(200).json({
      status: true,
      message: "fetched subscribers",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Server error", error });
  }
};
