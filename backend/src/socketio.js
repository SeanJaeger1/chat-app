const io = require("socket.io")();
const mongoose = require("mongoose");
const Message = require("./models/message");
const users = require("./utils/users");

io.on("connection", socket => {
  console.log("CONNECTED");

  socket.on("join", ({ username, room }) => {
    users.addUser(username, room, socket.id);
    socket.join(room);
    io.to(room).emit("presentUsers", users.getUsersInRoom(room));
  });

  socket.on("disconnect", () => {
    const disconnectingUser = users.removeUser(socket.id);
    if (disconnectingUser) {
      io.to(disconnectingUser.room).emit(
        "presentUsers",
        users.getUsersInRoom(disconnectingUser.room)
      );
    }
  });

  socket.on("sendMessage", async message => {
    console.log("sending message from server...");
    message._id = new mongoose.Types.ObjectId();
    const messageToSave = new Message(message);
    await messageToSave.save();
    io.to(message.room).emit("message", messageToSave);
  });
});

const port = 8000;

io.listen(port);
console.log(`SocketIO server is up on ${port}`);
