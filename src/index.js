const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/message.js");

const { addUser, removeUser, getUser, getRoomUsers } = require("./utils/users");

const app = express();

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("New User Connected");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    console.log(`${user.username} and ${user.room}`);

    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("enterMessage", `${user.username} has joined the chat`);

    io.to(user.room).emit("userList", {
      room: user.room,
      userList: getRoomUsers(user.room),
    });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback("delivered");
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "exitMessage",
        `${user.username} has left the chat`
      );
      io.to(user.room).emit("userList", {
        room: user.room,
        userList: getRoomUsers(user.room),
      });
    }
  });

  socket.on("location", (location, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(user.username, location)
      );
      callback("Shared!");
    }
  });
});
const port = process.env.PORT || 6060;

const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
