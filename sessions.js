// the introduction of sessions in express
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SECRET, // can put env variables here. install module by "npm i dotenv"
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

mongoose
  .connect("mongodb://localhost:27017/test", {
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("This is homepage.");
});

// verify first and restore verified info to session
app.get("/verifyUser", (req, res) => {
  req.session.isVerified = true; // set a new key (isVerified) as true into session.
  res.send("You are verified.");
});

// set a judgement if verified then show secret, whileas if not verified, don't show the secret.
app.get("/secret", (req, res) => {
  if (req.session.isVerified == true) {
    res.send("Here is my secret - I love panda.");
  } else {
    res.status(403).send("You are not authorized to see my secret.");
  }
});

// node.js -- process(get some informations about the server)
app.get("/processCheck", (req, res) => {
  console.log(process.platform);
  console.log(process.version);
  console.log(process.env.SECRET);
  res.send("Hi, welcome to processCheck.");
});

// flash
app.get("/flash", (req, res) => {
  req.flash("successed_msg", "successfully get to the homepage.");
  res.send(`Hi, ${req.flash("successed_msg")}`);
});

// page not found
app.get("/*", (req, res) => {
  res.status(404).send("404 page not found.");
});

// must be under homepage in order to catch errors when requesting /
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something is broken. We will fix it soon.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
