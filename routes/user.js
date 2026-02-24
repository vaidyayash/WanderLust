const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");


//  GET SIGNUP
router.get("/signup", userController.getSignup);


// POST SIGNUP
router.post(
  "/signup",
  saveRedirectUrl,
  wrapAsync(userController.postSignup),
);


// GET LOGIN
router.get("/login", userController.getLogin);


// POST LOGIN
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.postLogin),
);


// GET LOGOUT 
router.get("/logout", userController.getLogout);

module.exports = router;
