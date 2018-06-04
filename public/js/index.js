// Make Connection
var socket = io.connect("https://boun-chat.herokuapp.com?id=2");
//var socket = io.connect("http://localhost:3000/");

// Query Dom
var chatWindow = document.getElementById("chat-window");
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var clear = document.getElementById("clear");
var youtubeUrl = document.getElementById("youtubeUrl");
var videoBox = document.getElementById("videoBox");

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

youtubeUrl.addEventListener("keypress", e => {
  if (e.keyCode == 13) {
    id = getYoutubeId(youtubeUrl.value);
    if (id !== "") {
      video = "https://www.youtube.com/embed/" + id + "?autoplay=1";
      socket.emit("videoChange", video);
    }
    youtubeUrl.value = "";
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
    "<p><strong>" +
    data.handle +
    ":</strong> " +
    escapeHtml(data.message) +
    "</p>";
  feedback.innerHTML = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on("typing", data => {
  feedback.innerHTML = "<p><em>" + escapeHtml(data) + " is typing... </em></p>";
});

socket.on("videoChange", data => {
  videoBox.innerHTML =
    '<iframe id="videoFrame" src="' +
    data +
    '" style="position:absolute;width:100%;height:100%;left:0" width="641" height="360" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getYoutubeId(url) {
  var ID = "";
  url = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}
