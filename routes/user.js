const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const User = require("../models/user.js");


router.get("/signup", (req, res)=>{
  res.render("users/signup");
});

router.post("/signup", wrapAsync(async (req, res)=>{
  const {username, email, password} = req.body.user;
  const newUser = new User({username, email});
  await User.register(newUser, password);
  res.redirect("/listings");
}));

module.exports = router;