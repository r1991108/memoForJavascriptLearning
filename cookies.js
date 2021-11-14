// the introduction of cookies in express
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // in order to get datas from cookies, install cookie-parser and require it.

app.set("view engine", "ejs");
app.use(cookieParser(process.env.SECRET)); // use cookieParser to get data from cookies (the string in () is used for signing cookie)

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

// store key/value into cookies
app.get("/test1", (req, res) => {
  res.cookie("name", "Wilson");
  res.send("Welcome to test1.");
});

// get key/value from cookies
app.get("/test2", (req, res) => {
  console.log(req.cookies);
  let { name } = req.cookies;
  res.send(`${name}, welcome to homepage.`);
});

// store signed cookies
app.get("/storeSignedCookies", (req, res) => {
  res.cookie("address", "Hawaii St.", { signed: true });
  res.send("Cookie has been sent.");
});

// get signed cookies
app.get("/getSignedCookies", (req, res) => {
  console.log(req.signedCookies);
  let { address } = req.signedCookies;
  res.send(`Your address is ${address}`);
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
