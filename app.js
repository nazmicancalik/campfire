const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
var moment = require("moment");

var onlineCount = 0;

//Static path
const publicPath = path.join(__dirname, "/public");

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

// Setup
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// Static files.
app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user is connected", socket.id);
  onlineCount++;
  io.sockets.emit("onlineCount", onlineCount);

  // Handle chat event
  socket.on("chat", data => {
    data.time = moment().valueOf();
    //io.sockets.emit("chat", data);
    io.emit("chat", data);
  });

  // Handle typing event
  socket.on("typing", data => {
    socket.broadcast.emit("typing", data);
  });

  //Handle Video changed event
  socket.on("videoChange", data => {
    console.log("Video Changed event emitted");
    io.sockets.emit("videoChange", data);
  });

  socket.on("onlineCount", data => {
    onlineCount = data;
  });

  socket.on("disconnect", () => {
    onlineCount--;
    socket.broadcast.emit("onlineCount", onlineCount);
    console.log("User was disconnected");
  });
});

server.listen(port, () => {
  console.log("Server is up and running on port", port);
});
