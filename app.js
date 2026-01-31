// REQUIREMENTS
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilities/wrapAsync.js");
const ExpressError = require("./utilities/expressError.js");

// DATABASE CONNECTION
main()
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// CRUD OPERATIONS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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
app.post("/listings", wrapAsync(async (req, res, next) => {
  if(!req.body.listing){
    throw new ExpressError(400, "Invalid Listing Input");
  }
  let { listing } = req.body;
  let newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings");
}));

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/show", { listing });
}));

// Update Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/edit", { listing });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { listing } = req.body;
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, listing, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
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
