// Dependencies
const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const router = require("./router");

// Server setup
const server = http.createServer(app);
const io = socketIO(server);

// DB Setup
mongoose.connect("mongodb://localhost:test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// App Setup
app.set("port", 8080);
app.use(bodyParser.json({ type: "*/*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));

// Routing
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
router(app);

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

  socket.on("action", (action) => {
    const data = action.payload;
    switch (action.type) {
      case "JOIN_GAME":
        console.log("a user is joining", data.roomId);
        socket.join(data.roomId);
        break;
      case "START_GAME":
        console.log("starting", data.roomId);
        io.sockets.in(data.roomId).emit("START_GAME", data.data);
        break;
      case "FETCH_DATA":
      case "TO_JOKER_ROUND":
      case "TO_PRED_ROUND":
      case "TO_RESULTS_ROUND":
        io.sockets.in(data.roomId).emit(action.type);
        break;
      default:
        null;
    }
  });
});
