const mongoose = require("mongoose");
const fs = require("fs"); //file system
console.log(mongoose.version);

// connect to mongoDB
mongoose
  .connect("mongodb://localhost:27017/exampleDB", {
    //★★★Starting with Mongoose version 6, you should not specify that as an option. It will be handled automatically.
    // userNewUrlParser: true,
    // userUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongoDB.");
  })
  .catch((err) => {
    console.log("Connection Failed.");
    console.log(err);
  });

// ★★★★Schema type★★★
// 。String
// 。Number
// 。Date
// 。Boolean
// 。Object
// 。array

// define a schema - first way
// const studentSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   major: String,
//   scholarship: {
//     merit: Number,
//     other: Number,
//   },
// });

// define a schema - second way
// for setting validators you have to use second way.
// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   age: { type: Number, required: true, default: 18 },
//   major: { type: String, default: "undecied" },
//   scholarship: {
//     merit: { type: Number, default: 0 },
//     other: { type: Number, default: 0 },
//   },
// });
// define a schema - third way
// for setting validators you have to use second way.
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You forgot to enter the name of the student."],
    maxlength: [15, "Name is too long."], // restrict the length of name which must be under 15 chars
  },
  age: {
    type: Number,
    required: [true, "You forgot to enter the age of the student."],
    default: 18,
    min: [15, "too young."],
    max: [100, "too old."],
  },
  major: {
    type: String,
    default: "undecided",
    enum: ["Chem", "EE", "undecided"], // major can only be one which is enumerated
  },
  scholarship: {
    merit: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
});

// create an instance method
studentSchema.methods.totalScholarship = function () {
  return this.scholarship.merit + this.scholarship.other;
};

// create a static method
// doesn't belong to schema
studentSchema.statics.setOtherToZero = function () {
  return this.updateMany({}, { "scholarship.other": 0 });
};

// define middleware
// action before saving
studentSchema.pre("save", async function () {
  fs.writeFile("record.txt", "one data is tring to be saved.", (e) => {
    if (e) throw e;
  });
});
// action after saving
studentSchema.post("save", async function () {
  fs.writeFile("record.txt", "one data has been saved.", (e) => {
    if (e) throw e;
  });
});

// create a model for students
const Student = mongoose.model("Student", studentSchema);

// execute instance method
Student.findOne({ name: "Carl" })
  .then((data) => {
    let result = data.totalScholarship();
    console.log(`the total scholarship will be ${result}`);
  })
  .catch((e) => {
    console.log("error!!!");
    console.log(e);
  });

Student.find({}).then((data) => {
  data.forEach((oneStudent) => {
    console.log(
      `${
        oneStudent.name
      } has total scholarship = ${oneStudent.totalScholarship()}`
    );
  });
});

Student.setOtherToZero()
  .then((msg) => {
    console.log(msg);
  })
  .catch((e) => {
    console.log(e);
  });

// Mongo Shell db.collection.find()...
// １、create an object
const Jon = new Student({
  name: "Jon",
  age: 25,
  major: "EE",
  scholarship: {
    merit: 2500,
    other: 1300,
  },
});
const newStudent = new Student({
  name: "Banky3",
  age: 18,
  scholarship: {
    merit: "1500", // String will automatic be tranform into Number
    other: "2000", // String will automatic be tranform into Number
  },
  isMarried: true, // doesn't exist in schema, won't be saved
});

// ２、★★★★save Jon to DB★★★
// Jon.save()
//   .then(() => {
//     console.log("Jon has been saved into DB.");
//   })
//   .catch((e) => {
//     console.log("error has happend.");
//     console.log(e);
//   });
newStudent
  .save()
  .then(() => {
    console.log("newStudent has been saved.");
  })
  .catch((e) => {
    console.log("error has happened.");
    console.log(e);
    fs.writeFile("record.txt", "data is not saved.", (e) => {
      if (e) throw e;
    });
  });

// ２－２、★★★★update DB★★★
// Student.update(
//   {
//     name: "Jon",
//   },
//   { name: "Carl" }
// ).then((msg) => {
//   console.log(msg);
// });

// // ★★★★delete
// Student.deleteOne({
//   "scholarship.merit": { $gt: 4000 },
// }).then((msg) => {
//   console.log(msg);
// });

// // find objects in mongoDB
Student.find({}).then((data) => {
  console.log(data);
});
// complex conditions when find
// Student.find({ "scholarship.merit": { $gt: 2500 } }).then((data) => {
//   console.log(data);
// });
