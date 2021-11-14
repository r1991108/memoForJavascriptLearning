// the introduction of middleware using in express
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));
app.use((req, res, next) => {
  console.log("Hi, I am the first middleware.");
  next();
});
app.use((req, res, next) => {
  console.log("Hi, I am the second middleware.");
  next();
});
app.use((req, res, next) => {
  console.log(req.method);
  next();
});
// middleware as a variable
const testMiddleware = (req, res, next) => {
  console.log("this is a test3's first middleware.");
  next();
};
const testMiddleware2 = (req, res, next) => {
  console.log("this is a test3's second middleware.");
  next();
};

// a middleware only for spicific request
app.use("/test", (req, res, next) => {
  console.log("test request ok");
  next();
});

// mongoose
//   .connect("mongodb://localhost:27017/test", {
//     useFindAndModify: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to mongodb.");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

app.get("/", (req, res) => {
  res.send("Welcome to homepage.");
});

app.get("/test", (req, res) => {
  res.send("This is a test page.");
});

// middleware in get request
app.get(
  "/test2",
  (req, res, next) => {
    console.log("This is a test2 route.");
    next();
  },
  (req, res) => {
    res.send("This is a test2 page.");
  }
);

// using middleware as a variable in get request
app.get("/test3", testMiddleware, testMiddleware2, (req, res) => {
  res.send("This is a test3 page.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
