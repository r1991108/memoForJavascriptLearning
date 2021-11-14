// let try1 = require("./try1");
// let try2 = require("./try2");
// let greeting = require("./greeting");
// // console.log(try1);
// console.log(greeting);
// let myName = "Wilson Ren";
// let text = "How are you";
// greeting.morning(myName);
// greeting.night(myName);
// greeting.talk(text, myName);

// make path
let path = require("path");
let newPath = path.join(__dirname, "try.js");
console.log(newPath);

// check url
const url = require("url");
const pandaURL = "https://nodejs.org/dist/latest-v16.x/docs/api/path.html";
const parsedURL = url.parse(pandaURL, true);
console.log(parsedURL.host);
console.log(parsedURL.query);

// fs system
const fs = require("fs");
fs.writeFile("try.txt", "Today is a good day", (e) => {
  if (e) throw e;
  console.log("File has been written");
});

fs.readFile("./try.txt", "utf8", (e, data) => {
  if (e) throw e;
  console.log(data);
});

// cowsay
const cowsay = require("cowsay");
const { resolveObjectURL } = require("buffer");
console.log(
  cowsay.say({
    text: "I'm a cool cow",
    e: "@.@",
    T: "O ",
  })
);

// callback hell
function getData(name, callback) {
  setTimeout(() => {
    callback({ name: name, age: 26, major: "CS" });
  }, 2000);
}

function getMovies(age, callback) {
  if (age < 12) {
    setTimeout(() => {
      callback("cartoon movies");
    }, 1500);
  } else if (age < 18) {
    setTimeout(() => {
      callback("teen movies");
    }, 1500);
  } else {
    setTimeout(() => {
      callback("adult movies");
    }, 1500);
  }
}
getData("Wilson", (obj) => {
  console.log(obj);
  getMovies(obj.age, (str) => {
    console.log(str);
  });
});

// Promise
let example = new Promise((resolve, reject) => {
  resolve({ name: "Wilson", age: 20 });
  // reject(new Error("not allowed"));
});

example
  .then((d) => {
    console.log(d);
  })
  .catch((e) => {
    console.log(e);
  });

// use Promise to prevent coding callback function
function getData(name) {
  if (name == "Wilson") {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ name: "Wilson Ren", age: Math.floor(Math.random() * 50) });
      }, 2000);
    });
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Not allowed to access data."));
      }, 2000);
    });
  }
}

function getMovies(age) {
  if (age < 12) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ text: "cartoon" });
      }, 1500);
    });
  } else if (age < 18) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ text: "teen movies" });
      }, 1500);
    });
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ text: "adult movie" });
      }, 1500);
    });
  }
}

// way1. using then mothod of Promise
getData("Wilson")
  .then((obj) => {
    console.log(obj);
    return getMovies(obj.age);
  })
  .then((msg) => {
    console.log(msg.text);
  })
  .catch((e) => {
    console.log(e);
  });

// way2. using async await try catch
async function showMovie() {
  try {
    const obj = await getData("Wilson");
    const movie = await getMovies(obj.age);
    console.log(movie.text);
  } catch (e) {
    console.log(e);
  }
}
showMovie();

// Learning API
// endpoint, path, query
// ex. postman
// using fetch API to get datas
async function getJoke() {
  let data = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
  let parsedData = await data.json();
  console.log(parsedData);
}
getJoke();

// API which needs key
// ex. openWeather
let myKey = "c6e2fde096a76ee44d57bb485cdfe321";
let city = "Taipei";
let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;
async function getWeather() {
  let d = await fetch(url);
  let dj = await d.json();
  console.log(dj);
}
getWeather();
