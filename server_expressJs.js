const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");

// middleware
// bodyParsing
app.use(bodyParser.urlencoded({ extended: true }));
// serving a static file
app.use(express.static("public")); // "public" can be any string. It's just the folder name which you want to serve.
app.set("view engine", "ejs");

// request handling
// handle different request
app.get("/", (req, res) => {
  // res.send("<h1>you are on the homepage</h1>"); // can only send once
  // console.log(`${__dirname}/index.html`);
  // res.sendFile(`${__dirname}/index.html`);
  res.sendFile(path.join(__dirname, "/index.html"));
});

// post request
app.post("/formHandling_post", (req, res) => {
  // console.log(req.body);
  let { name, age } = req.body;
  res.send(
    `<h1>Thanks for submitting. The name is ${name} . Age is ${age}</h1>`
  );
});

// get request
app.get("/formHandling_get", (req, res) => {
  // console.log(req.body);
  let { name, age } = req.query;
  res.send(
    `<h1>Thanks for submitting. The name is ${name} . Age is ${age}</h1>`
  );
});

// send object
app.get("/obj", (req, res) => {
  let obj = {
    name: "testObject",
    builtTime: 20211106,
  };
  res.send(obj);
});

app.get("/wilson", (req, res) => {
  res.send("This is Wilson's page");
});

app.get("/mike", (req, res) => {
  res.status(302);
  res.send("Mike doesn't exist anymore.");
});

// routing for patten. e.g. for those requests that return same page
app.get("/fruits/:somefruits", (req, res) => {
  // first way
  // res.send(`You are looking for ${req.params.somefruits}`);

  // second way
  let { somefruits } = req.params; // destructing on object
  console.log(somefruits);
  res.send(`you are looking for ${somefruits}`);
});

// making html file by ejs and send back to user
app.get("/ejs", (req, res) => {
  res.render("index.ejs"); // index.ejs must be in "views" folder or it will send error
});
app.get("/ejs/:name", (req, res) => {
  let { name } = req.params;
  res.render("person.ejs", { name });
});
app.get("/resForEjs", (req, res) => {
  let { name, age } = req.query;
  // res.send("tanks for sending");
  res.render("respond.ejs", { name, age });
});
app.get("/arrayForEJS", (req, res) => {
  // database => an array of objects
  const languages = [
    { name: "python", rating: 9.5, popularity: 9.7, trending: "super hot" },
    { name: "java", rating: 8.6, popularity: 8.2, trending: "same" },
    { name: "c++", rating: 6.6, popularity: 7.7, trending: "same" },
    { name: "php", rating: 2.5, popularity: 4.7, trending: "decreasing" },
    { name: "javascript", rating: 8.5, popularity: 8.1, trending: "same" },
  ];
  res.render("array.ejs", { languages });
});

// routing for all. e.g. for those requests that page doesnt exit
app.get("/*", (req, res) => {
  console.log("Something went wrong");
  res.status(404);
  console.log(res.statusCode);
  res.send("<h1>Ooops, No page found. </h1>");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
