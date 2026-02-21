const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { populate } = require("../models/review.js");

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index", { listings });
  }),
);

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
      path: "reviews", populate:{
      path: "author"
      }
    })
    .populate("owner");
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    // console.log(currUser);
    res.render("listings/show", { listing });
  }),
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", { listing });
  }),
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { listing } = req.body;
    let { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
      runValidators: true,
      new: true,
    });

    if (!updatedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.redirect(`/listings/${id}`);
  }),
);

// DELETE ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

module.exports = router;
