const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilities/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); 
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");


// CRUD OPERATIONS - REVIEWS

// Create Route 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.create));


// Delete Route 
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.delete));

module.exports = router;