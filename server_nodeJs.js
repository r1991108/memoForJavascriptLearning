const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });

    // res.write(`<h1>You are on the homepage.</h1>`);
    // res.write(
    //   `<p>You can type something at the end of the url to visit other content.</p>`
    // );
    // res.end();
  } else {
    let parsedURL = url.parse(req.url);

    res.write(`Hello, ${parsedURL.pathname}`);
    res.end();
  }

  //   console.log(req.url);
});

server.listen(3501, () => {
  console.log("Server is running on port 3501.");
});
