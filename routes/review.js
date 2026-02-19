const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilities/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); 
const { validateReview } = require("../middleware.js");


// CRUD OPERATIONS - REVIEWS

// Create Route (Reviews)
router.post("/", validateReview, wrapAsync(async (req, res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);
  listing.reviews.push(review._id);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
}));


// Delete Route (Reviews)
router.delete("/:reviewId", wrapAsync(async (req, res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;