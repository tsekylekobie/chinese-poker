// Dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var pokersolver = require("pokersolver");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var Hand = pokersolver.Hand;

app.set("port", 8080);
app.use(express.static(path.join(__dirname, "build")));

// Routing
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Starts the server.
server.listen(8080, function () {
  console.log("Starting server on port 8080");
});

// Add the WebSocket handlers
io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("submit", (h1, h2, h3) => {
    hand1s.push({ p1: h1 });
    hand2s.push({ p1: h2 });
    hand3s.push({ p1: h3 });
    io.emit("status", "Waiting for other players...");
  });
});

const hand1s = {};
const hand2s = {};
const hand3s = {};
