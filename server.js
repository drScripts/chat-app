const express = require("express");
const app = express();
const http = require("http");
const socket = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");

const {
  formatMessage,
  userJoin,
  getUser,
  userLeave,
  getUserRoom,
} = require("./utils/messages");

const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    const userData = userJoin(socket.id, username, room);

    io.to(room).emit("updateUser", getUserRoom(room));
    socket.emit("userJoin", getUser(socket.id));
    // emit to the user connected
    socket.emit(
      "welcomeMessage",
      formatMessage("System", `Welcome, to ChatCord ${username}`)
    );

    // emit to the disconnected user
    socket.broadcast
      .to(room)
      .emit(
        "message",
        formatMessage("System", `Hey ${username} has join to the room`)
      );

    socket.on("chatMessage", (msg) => {
      io.to(room).emit("message", formatMessage(msg.username, msg.msg));
    });

    // RUns when client disconnect
    socket.on("disconnect", () => {
      const allUser = userLeave(userData.id);

      io.to(room).emit("updateUser", getUserRoom(room));
      io.to(room).emit(
        "message",
        formatMessage("System", `${username} Has Disconnected`)
      );
    });
  });
});
