// REQUIREMENTS
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/expressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");


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

const sessionOptions = {
  secret: "myezpzsecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
  },
};
 

app.use(session(sessionOptions)); 


app.get("/", (req, res) => {
  res.send("App is working");
});

// CRUD OPERATIONS - LISTINGS
app.use("/listings", listings);


// CRUD OPERATIONS - REVIEWS
app.use("/listings/:id/reviews", reviews);

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

