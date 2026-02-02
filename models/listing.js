const mongoose = require("mongoose");

let listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
    trim: true,
    minlength: [5, "Title must be atleast 5 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  image: {
    filename: { type: String, default: "listingimage", required:true },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
      set: (v) => (v === "" ? undefined : v),
      match: [/^https?:\/\/.+/i, "Please enter a valid image URL"],
      required: true,
    },
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Price is Required"],
    min: [0, "Price cannot be negative"],
  },
  location: {
    type: String,
    required: [true, "Location is Required"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is Required"],
    trim: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


