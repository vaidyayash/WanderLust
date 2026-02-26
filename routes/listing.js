const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Index Route
router.get(
  "/",
  wrapAsync(listingController.index)
);

// New Route
router.get("/new", isLoggedIn, listingController.new);


// Create Route
router.post(
  "/",
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.create),
);



// Show Route
router.get( 
  "/:id",
  wrapAsync(listingController.show),
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.edit)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.update),
);

// DELETE ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.delete),
);

module.exports = router;
