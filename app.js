
// REQUIREMENTS
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// DATABASE CONNECTION
main()
.then(() => console.log("Connection Successful"))
.catch((err) => console.log(err));

async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// CRUD OPERATIONS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res)=>{
  res.send("App is working");
});

// Index Route
app.get("/listings", async (req, res)=>{
  let listings = await Listing.find({});
  res.render("listings/index", {listings});
});

// New Route
app.get("/listings/new", (req, res)=>{
  res.render("listings/new");
});

app.post("/listings", async (req, res)=>{
  let {listing} = req.body;
  let newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings");
});

// Show Route
app.get("/listings/:id", async (req, res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show", {listing});
});

// Update Route
app.get("/listings/:id/edit", async (req, res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit", {listing});
});

app.put("/listings/:id", async (req, res)=>{
  let {listing} = req.body;
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, listing, {
    runValidators: true,
    new: true
  });
  res.redirect(`/listings/${id}`);
});

// DELETE ROUTE
app.delete("/listings/:id", async (req, res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(port, ()=>{
  console.log(`Server is running at port ${port}`);
});

