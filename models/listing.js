const mongoose = require("mongoose");
const Review = require("./review.js");

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
    filename: String,
    url: String
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
  reviews: [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
