const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const User = require("../models/user.js");
const { errors } = require("passport-local-mongoose");
const passport = require("passport");
const isLoggedIn = require("../middleware.js")

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, err) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err)=>{
        if(err){
          next(err);
        } else {
          req.flash("success", "Welcome to WanderLust");
          res.redirect("/listings");
        }
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome to WanderLust");
    res.redirect("/listings");
  }),
);

router.get("/logout", (req, res, next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    } else {
      req.flash("success", "User Logged Out");
      res.redirect("/listings");
    }
  });
});

module.exports = router;
