const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
var moment = require("moment");

//Static path
const publicPath = path.join(__dirname, "/public");
const {isRealString} = require('./public/js/utils/validation');
const {Users} = require('./public/js/utils/users');
const SYSTEM_ALIAS = "Campfire";

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

// Setup
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


// Static files.
app.use(express.static(publicPath));

io.on("connection", socket => {
  

  // Join page event
  socket.on('join',(params,callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }
    
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    
    // Send join message by admin [Admin]: X is joined.
    socket.broadcast.to(params.room).emit("chat", {
      message: `${params.name} has joined the room.`, 
      username: SYSTEM_ALIAS
    });
    callback();
  });

  // Handle chat event
  socket.on("chat", data => {
    var user = users.getUser(socket.id);

    if(user && isRealString(data.message)) {
      data.username = user.name;
      data.time = moment().valueOf();
      io.to(user.room).emit("chat", data);
    }
  });

  // Handle typing event
  socket.on("typing", data => {
    var user = users.getUser(socket.id);

    socket.broadcast.to(user.room).emit("typing", data);
  });

  // Handle video changed event
  socket.on("videoChange", data => {
    var user = users.getUser(socket.id);

    console.log("Video Changed event emitted");
    io.to(user.room).emit("videoChange", data);
  });

  // Handle player events
  socket.on("pause-video", data => {
    io.to(data.room).emit("pause-video");
  });

  socket.on("play-video", data => {
    io.to(data.room).emit("play-video");
  });

  socket.on("seek", data => {
    var user = users.getUser(socket.id);

    io.to(user.room).emit("seek",data);
  })

  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      socket.broadcast.to(user.room).emit("chat", {
        message: `${user.name} has left the room.`, 
        username: SYSTEM_ALIAS
      });
    }
  })
});

server.listen(port, () => {
  console.log("Server is up and running on port", port);
});
