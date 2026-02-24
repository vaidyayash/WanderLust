const User = require("../models/user");
const express = require("express");

//  GET SIGNUP
module.exports.getSignup = (req, res) => {
  res.render("users/signup");
};

// POST SIGNUP
module.exports.postSignup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        const redirectUrl = res.locals.redirectUrl || "/listings";
        req.flash("success", "Welcome to WanderLust");
        res.redirect(redirectUrl);
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// GET LOGIN
module.exports.getLogin = (req, res) => {
  res.render("users/login");
};

// POST LOGIN
module.exports.postLogin = async (req, res) => {
  req.flash("success", "Welcome to WanderLust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// GET LOGOUT 
module.exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "User Logged Out");
      res.redirect("/listings");
    }
  });
};