const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utilities/expressError.js");


// Create Route
module.exports.create = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review._id);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.delete = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
