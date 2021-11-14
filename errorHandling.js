// the introduction of errorHandling in express
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");

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

const monkeySchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
  },
});

const Monkey = mongoose.model("Monkey", monkeySchema);

// validator error has to be caught by .catch
app.get("/addMonkey/:name", (req, res) => {
  let { name } = req.params;
  try {
    let newMonkey = new Monkey({ name });
    newMonkey
      .save()
      .then(() => {
        res.send("data has been saved.");
      })
      .catch((e) => {
        console.log("test1");
        res.send("something happened while adding monkey.");
      });
  } catch (e) {
    // catch errors if typo error
    console.log("test2");
    next(e);
  }
});

// find all monkeys
app.get("/findAllMonkeys", async (req, res) => {
  try {
    let d = await Monkey.find({});
    res.send(`Here are your monkeys.<br> ${d}`);
    console.log(d);
  } catch (e) {
    res.send(e);
  }
});

// find a monkey
app.get("/findMonkey/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let d = await Monkey.findOne({ name });
    console.log(d);
    if (d !== null) {
      res.send("Here is your monkey.");
    } else {
      res.send("no such monkey.");
    }
  } catch (e) {
    res.send(e);
  }
});

// find a monkey and update
app.put("/updateMonkey/:name/:toName", async (req, res) => {
  let { name, toName } = req.params;
  try {
    let d = await Monkey.findOneAndUpdate(
      { name },
      { toName },
      { new: true, runValidators: true },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    );
    console.log(d);
    // if (d !== null) {
    //   res.send("Here is your monkey.");
    // } else {
    //   res.send("no such monkey.");
    // }
  } catch (e) {
    res.send(e);
  }
});

// ★★★　find a monkey
// when catching error in async functions, you should use "next" to pass the error to errorHandler
app.get("/typeError2/:name", async (req, res, next) => {
  let { name } = req.params;
  try {
    let d = await Monkey.findOned({ name }); // findOne's typo
    console.log(d);
    res.send("Here is your monkey.");
  } catch (e) {
    next(e);
  }
});

app.get("/", (req, res) => {
  res.send("this is homepage.");
});

// page not found
app.get("/*", (req, res) => {
  res.status(404).send("404 page not found.");
});

// when type error happens, status 500 will be caught by error handler
app.get("/typeError", (req, res) => {
  res.sends("this is homepage."); // should be send
});

// must be under homepage in order to catch errors when requesting /
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something is broken. We will fix it soon.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
