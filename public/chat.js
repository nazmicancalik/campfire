// Make Connection
var socket = io.connect("https://boun-chat.herokuapp.com?id=2");

// Query Dom
var chatWindow = document.getElementById("chat-window");
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var clear = document.getElementById("clear");

// Emit events
btn.addEventListener("click", () => {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value
  });
  message.value = "";
});

message.addEventListener("keypress", e => {
  console.log("Cool");
  socket.emit("typing", handle.value);

  if (e.keyCode == 13) {
    btn.click();
    message.value = "";
  }
});

document.addEventListener("keypress", () => {
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

clear.addEventListener("click", () => {
  output.innerHTML = "<p></p>";
});

// Listen for eventss
socket.on("chat", data => {
  output.innerHTML +=
    "<p><strong>" + data.handle + ":</strong> " + data.message + "</p>";
  feedback.innerHTML = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on("typing", data => {
  feedback.innerHTML = "<p><em>" + data + " is typing... </em></p>";
});