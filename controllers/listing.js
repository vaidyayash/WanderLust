const Listing = require("../models/listing");
const ExpressError = require("../utilities/expressError.js");

// Index Route
module.exports.index = async (req, res) => {
  let listings = await Listing.find({});
  res.render("listings/index", { listings });
};

// New Route
module.exports.new = (req, res) => {
  res.render("listings/new");
};

// Create Route
module.exports.create = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  res.redirect("/listings");
};

// Show Route
module.exports.show = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  // console.log(currUser);
  res.render("listings/show", { listing });
};

// Edit Route
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/edit", { listing });
};

// Update Route
module.exports.update = async (req, res) => {
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
};


// DELETE ROUTE
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};
