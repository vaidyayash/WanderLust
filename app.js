// REQUIREMENTS
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const Review = require("./models/review.js"); 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilities/wrapAsync.js");
const ExpressError = require("./utilities/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const review = require("./models/review.js");


// DATABASE CONNECTION
main()
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.message);
  } else{
    next();
  }
}

const validateReview = (req, res, next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400, error.message);
  } else{
    next();
  }
}

// CRUD OPERATIONS - LISTINGS

app.get("/", (req, res) => {
  res.send("App is working");
});

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  let listings = await Listing.find({});
  res.render("listings/index", { listings });
}));

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Create Route
app.post(
  "/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/show", { listing });
}));


app.get(
  "/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", { listing });
  }),
);

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  const { listing } = req.body;
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
    runValidators: true,
    new: true,
  });

  if (!updatedListing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  await Review.deleteMany({_id: {$in: listing.reviews}});
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));


// CRUD OPERATIONS - REVIEWS

// Create Route (Reviews)
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);
  listing.reviews.push(review._id);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
}));


// Delete Route (Reviews)
app.delete("/listings/:listingId/reviews/:reviewId", wrapAsync(async (req, res)=>{
  let {listingId, reviewId} = req.params;
  await Listing.findByIdAndUpdate(listingId, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${listingId}`);
}));


app.use((req, res, next)=>{
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let {status=500, message="Something Went Wrong"} = err;
  res.status(status).render("listings/error", {err});
});



app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

