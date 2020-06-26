// Dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const routes = require("./router");

const PORT = process.env.PORT || 8080;

const server = express()
  .use(bodyParser.json({ type: "*/*" }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, "..", "..", "build")))
  .use("/api", routes)
  .get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"))
  )
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// Add the WebSocket handlers
const io = socketIO(server);
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

// DB Setup
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
