// Get the socketconnection 
var socket = io();


// For development use: 
// var socket = io("http://localhost:3000");

// Query Dom
var chatWindow = document.getElementById("chat-window");
var message = document.getElementById("message");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var clear = document.getElementById("clear");
var youtubeUrl = document.getElementById("youtubeUrl");
var videoBox = document.getElementById("videoBox");

// Emit events
btn.addEventListener("click", () => {
  var params = jQuery.deparam(window.location.search);

  socket.emit("chat", {
    message: message.value,
    username: params.name
  });

  message.value = "";
});



youtubeUrl.addEventListener("keypress", e => {
  if (e.keyCode == 13) {
    id = getYoutubeId(youtubeUrl.value);
    if (id !== "") {
      video = "https://www.youtube.com/embed/" + id + "?autoplay=1";
      socket.emit("videoChange", video);
    }
    youtubeUrl.value = id;
  }
});

document.addEventListener("keypress", () => {
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

clear.addEventListener("click", () => {
  output.innerHTML = "<p></p>";
});

// Listen for events
socket.on("chat", data => {
  output.innerHTML +=
    "<div id='single-message'><div class='row'><div class='col-md-10'><p><strong>" +
    escapeHtml(data.username) +
    ": </strong>" +
    escapeHtml(data.message) +
    "</p></div><div class='col-md-2'><em><font size='1'>" +
    moment(data.time).format("H:mm:s") +
    "</font></em></div></div></div>";
  feedback.innerHTML = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on("typing", data => {
  feedback.innerHTML = "<p><em>" + escapeHtml(data) + " is typing... </em></p>";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on("videoChange", data => {
  videoBox.innerHTML =
    '<iframe id="videoFrame" src="' +
    data +
    '" style="position:absolute;width:100%;height:100%;left:0" width="641" height="360" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
});

socket.on("connect", function() {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      // Send to main page
      alert(err);
      window.location.href = '/';
    }else {
      console.log('No error');
    }
  });

  message.addEventListener("keyup", e => {
    socket.emit("typing", params.name);
    if (e.keyCode == 13) {
      btn.click();
      message.value = "";
    }
  });

});

socket.on("updateUserList", function(users) {
  console.log(users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
})

socket.on("disconnect", function() {
  console.log("Disconnected from server");
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
    ID = "EL_pBJN_O3M";
  }
  return ID;
}
