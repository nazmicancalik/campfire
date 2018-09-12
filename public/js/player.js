var tag = document.createElement('script');
var playButton = document.getElementById('play');
var pauseButton = document.getElementById('pause');
var seekbarPosition = jQuery('#seekbar-position');
var seekbar = jQuery('#seekbar-wrapper');

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
        controls: 1,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  setInterval(function() {
    seekbarPosition.css('left',String(getSeekPosition())+'%');
  },250)
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
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.BUFFERRING) {
    var params = jQuery.deparam(window.location.search); 
    
    socket.emit("pause-video", {
      room: params.room
    });
  }
}

function stopVideo() {
  player.stopVideo();
}

// =================================================
//                    Dom Events
// =================================================

playButton.addEventListener("click", function() {
  player.playVideo();
});

pauseButton.addEventListener("click", function() {
  player.pauseVideo();
});

seekbar.on("click", function(event){
  var x = event.pageX - seekbar.offset().left;
  var seekbarPercentage = x / seekbar.width();
  seekbarPosition.css('left',String(seekbarPercentage * 100)+'%');
  
  var currentTime = seekbarPercentage * player.getDuration();

  socket.emit("seek", {
    currentTime: currentTime
  });
});

// =================================================
//                    Helper Functions
// =================================================

function getSeekPosition() {
  var percentage = player.getCurrentTime() / player.getDuration()*100;
  var mappedPercentage = percentage * (97.5) / 100 + 0.5;
  return mappedPercentage;
}
