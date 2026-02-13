const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {
  secret: "myezpzsecretcode",
  saveUninitialized: true,
  resave: false
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res)=>{
  let {name = "anonymous"} = req.query;
  req.session.name = name;
  req.flash("company", "mowgli is bloody bastard bitch");
  res.redirect("/hello");
});

app.get("/hello", (req, res)=>{
  res.render("page.ejs", {name: req.session.name, message: req.flash("company")});
});






// app.get("/test", (req, res)=>{
//   res.send("test successful");
// });

// app.get("/", (req, res) => {
//   res.send("hey");
// });

app.listen(4000, () => {
  console.log("Server is running at port 4000");
});

