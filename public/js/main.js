const socket = io();

/// get params
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

$("#room-name").html(room);

socket.emit("joinRoom", { room, username });

socket.on("message", (stream) => {
  outputMessage(stream.text, stream.username, stream.time);
});

socket.on("welcomeMessage", (stream) => {
  outputMessage(stream.text, stream.username, stream.time);
});

socket.on("updateUser", (stream) => {
  $("#users").html(
    stream.map(
      (str) => `
  <li>${str.username}</li>`
    )
  );
});

$("#chat-form").on("submit", (e) => {
  e.preventDefault();
  const msg = $("#msg").val();
  $("#msg").val("");
  socket.emit("chatMessage", {
    msg,
    username,
  });
});

function outputMessage(message, author = "Brad", time) {
  $("#message-field").append(`
  <div class="message">
  <p class="meta">${author} <span>${time}</span></p>
  <p class="text">
    ${message}
  </p>
</div>
  `);
}
