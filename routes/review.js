const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); 
const { reviewSchema } = require("../schema.js");


const validateReview = (req, res, next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400, error.message);
  } else{
    next();
  }
}

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