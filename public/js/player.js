// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '690',
    width: '1500',
    videoId: 'u1_oZJ1ujUw',
    playerVars: {
        controls: 0,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING ) { 
    var params = jQuery.deparam(window.location.search); 
    
    socket.emit("play-video", {
      room: params.room
    });
  } else if (event.data === YT.PlayerState.PAUSED) {
    var params = jQuery.deparam(window.location.search); 
    
    socket.emit("pause-video", {
      room: params.room
    });
  }
}

function stopVideo() {
  player.stopVideo();
}