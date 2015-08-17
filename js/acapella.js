/* Copyright 2015 Andrew Mcloughlin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

   function getByID(id) {
    return document.getElementById(id);
}
var mediaConfirmed = false;
var autoTimes = false;
var manual = true;
var toggleRec = false;
var layer = 0;
var songList;
var giveLyricID;
var givembid;
 var beat = document.getElementById("countIn");
var countIn = document.getElementById("countIn");
var recordVideo = getByID('record-video'),
stopRecordingVideo = getByID('stop-recording-video');
var video = getByID('video');
var audio = getByID('audio');
var asd = "8f0d54d285f21a22e05c6c64d8afeadb";
var videoConstraints = {
    audio: true,
    video: {
        mandatory: {},
        optional: []
    }
};
var acapella = {
    init : function(){

        acapella.browser();
        var params = {},
        r = /([^&=]+)=?([^&]*)/g;
        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        var match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[d(match[1])] = d(match[2]);
        window.params = params;

      $(stopRecordingVideo).on('click', function() {
          acapella.stopRecording();
      });

      $(recordVideo).on('click', function() {
            toggleRec = !toggleRec;
            console.log(toggleRec);
            if(mediaConfirmed === false){
                acapella.confirmMedia();
             } else{

              $(this).toggleClass('on');
              // countIn.play();
              //
              if(toggleRec === true) {
                acapella.countRec();
              }

              if (toggleRec === false) {
                if (recorder){
                acapella.stopRecording();
                $(recordVideo).removeClass('on');
                  $('.countDown').text('press "rec" to start a new layer ');
              }
              }
              //  else{

              //   acapella.stopRecording();
              // }


          }
       });

        $('.media').on('click', function(event) {
            event.preventDefault();
            acapella.confirmMedia();
            $('.recordFeature').show('fast');
        });
        $('.closeMe').on('click', function(event) {
            event.preventDefault();
            acapella.deleteRecording();
        });
        $('.closeLayer').on('click', function(event) {
            event.preventDefault();
            acapella.deleteLayer();

        });
        $('.needlyrics').on('click', function(event) {
            event.preventDefault();
            acapella.lyricsPop();

        });

        $('.manual').on('click', function(event) {
             $('.auto').removeClass('active');
          $(this).addClass('active');
            event.preventDefault();
            $('.thecount').hide('fast');
            autoTimes = false;
             manual = true;
             console.log(manual);

        });
          $('.auto').on('click', function(event) {
              $('.manual').removeClass('active');
            $(this).addClass('active');
            event.preventDefault();
            $('.thecount').show('fast');
              autoTimes = true;
             manual = false;
             console.log(autoTimes);

        });

        $('.confirm').on('click', function(){
          console.log('clicked')
          var theSong = $('fieldset input').val();
                acapella.lyricsSearch();
          console.log(theSong);
        });
        $('.togglevid').on('click', function() {
         $('#showhide').toggleClass('view');
        });

    },
    stopRecording : function(){
       acapella.blobExtras();
       $('.thecontrol').removeClass('blink_me');
       $('#record-video').removeClass('on');
       $('.status').text('');
       this.disabled = true;
       recordVideo.disabled = false;
       if (recorder)
        recorder.stopRecording(function(url) {
         layer++;
         var player = $('<video>').attr({
                // autoplay : '',
                loop : 'loop',
                height : 210,
                width : 290,
                controls: true,
                //     controls: '',
                src : url
            }).addClass('videoLayer');



         $('#layers').prepend(player);
         player[0].play();

            var download = $( ".downloads" ).append( "<li><a target='_blank' download href="+ url +">layer download</a></li>" );

            $(function() {
              window.setInterval(function() {
                $('video.videoLayer').each(function(i,el){
                  if(this.ended) {
                    this.load();
                    this.play();
                }

            })
            },0);
          });

        });
},//end of stop recording
startRecording : function(isRecordVideo){

    $('.helper').hide('fast');
    $('.thecontrol').addClass('blink_me');
    // $('.status').text('recording layer..');
                    recorder = window.RecordRTC(acapella.stream, acapella.options);
                    recorder.startRecording();
                    video.onloadedmetadata = false;
        },//end of start recording
       blobExtras : function(){
         $( ".videoLayer" ).prepend("<a href='#'><img src='../img/close.png' /></a>" );
         $('.closeMe').show();
     },//end of blog extras
        deleteRecording : function(){
             location.reload();
        },//end of delete recording
        deleteLayer : function(){
          console.log('layer deleted');
        },
        countRec : function(){

           var counter = $('#number').val();
           var countDown = 4;
           setInterval(function(){
            countDown --;
              if (countDown >= 1){
                 $('.countDown').html('you are live in... '+ countDown);
                 acapella.hihatPlay();
                }
                if (countDown === 0){
                 if( manual === true){
                  manualRecord();
                 }else{
                 countRecord();
               }
              }
           }, 1000);
// countIn.addEventListener("ended", function()
//      {
//           countIn.currentTime = 0;
//           countRecord();
//      });
          function manualRecord(){


              acapella.hihatStop();
              if (toggleRec === true){
                  console.log('its true')
                  acapella.startRecording(true);
                  $('.countDown').html('<span style="color:red;">RECORDING: press record button again to stop</span>');

              }

          }
           function countRecord(){
            acapella.hihatStop();
             acapella.startRecording(true);
            setInterval(function(){
              counter--;
              if (counter >= 0){
                  $('.countDown').html('<span style="color:red;">RECORDING:</span> ' + counter + ' seconds left ');
              }
              if (counter === 0){
                toggleRec === false;
                acapella.stopRecording();
                $('#save').show('fast');
                // $('#record').attr('src', 'img/mic128.png');
                $('.countDown').text('press "rec" to start a new layer ');

              }

            } ,1000);
          }

        },//endof count rec
        hihatPlay : function(){
            beat.play();

        },//hihat play
        hihatStop : function(){
          beat.pause();

      },// hihat stop
      confirmMedia : function(isRecordVideo){

        navigator.getUserMedia(videoConstraints, function(stream) {
            video.onloadedmetadata = function() {
                video.width = 290;
                video.height = 210;
                acapella.options = {
                    type: 'video',
                    video: video,
                    canvas: {
                        width: 320,
                        height: 240
                    },
                    disableLogs: params.disableLogs || false,
                        recorderType: null // to let RecordRTC choose relevant types itself
                    };
                    acapella.stream = stream;
                    // recorder = window.RecordRTC(stream, options);
                    // recorder.startRecording();
                    // video.onloadedmetadata = false;
                };
                video.src = URL.createObjectURL(stream);
            }, function() {

            });
        mediaConfirmed = true;
        window.isAudio = false;
        if (isRecordVideo) {
            recordVideo.disabled = true;
                // stopRecordingVideo.disabled = false;

            }


},// end of confirm media
browser : function(){
   var userAgent = navigator.userAgent;

   if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
   {
     console.log('yup, this is firefox')
 }else{

   swal({
    title: "im sorry, you need firefox to run acapellaJS",
    text: "Please close this browser and open up firefox to run acapellaJS.",
    imageURL: alert,
    showCancelButton: false,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'ok ill change browser',
    closeOnConfirm: true,
})
}
 }, // end of browser
 lyricsPop : function(){
  $('.helper').fadeOut('fast');
  swal({
    title: "type in a song to get lyrics",
    text: "your song title:",
    type: "input",
    inputValue : "jump around",
    showCancelButton: true,
    closeOnConfirm: true,
    animation: "slide-from-top",
    inputPlaceholder: "jump around"
  },
  function(theSong){

    acapella.lyricsSearch(theSong);
    if (theSong === false) return false;

    if (theSong === "") {
      swal.showInputError("You didnt enter a song!");
      return false
    }
  });
},//end of lyrics pop
lyricsSearch : function(theSong){
  // var song = theSong;

  $.ajax({
    url: 'http://api.musixmatch.com/ws/1.1/track.search',
    type: 'GET',
    data: {
      apikey: asd,
      format: 'jsonp',
      f_has_lyrics : 1,
      q_track: theSong
    },
    dataType: 'jsonp',
    success: function(result){
       $('.lyricHelp').html('');
      console.log(result.message.body.track_list);
      var trackList = result.message.body.track_list;
if (trackList == '') {
swal({
    title: "i'm sorry, i couldnt find your song!",
    showCancelButton: true,
    closeOnConfirm: true,
    animation: "slide-from-top"
  })
}

      // $('button.confirm').on('click', function(event) {
        // event.preventDefault();
        /* Act on the event */
        $.each(trackList, function(i, trackObject){
          console.log(track);
          var track = trackObject.track;
          var getLyrics = track.track_id;
          var mbid = track.track_id;

          var title = $('<h2>').html(track.track_name);
          var artist = $('<p>').addClass('artist').text(track.artist_name);
          console.log(track.artist_name);
          var image = $('<img id="'+mbid+'">').attr('src', track.album_coverart_100x100);
          var thediv = $('<div id="'+getLyrics+'">').addClass('miniPick').append(image, title, artist);
          var songInfo = $('<a href="#">').append(thediv);
          // $('a div.miniPick').attr('id', 'getLyrics');

          $('.lyricHelp').append(songInfo);
          console.log(songInfo);



          // console.log($('.thelist'));

        });
      // });
         $('a div.miniPick').on('click', function(e) {
            e.preventDefault()
            /* Act on the event */
            giveLyricID = $(this).attr('id');
            givembid = $(this).closest('img').attr('id');
            console.log('the other id is' + givembid);
            console.log('lyric id is' +giveLyricID);
            acapella.lyricsGet();
          });

    }
  });
},// lyrics end
lyricsGet : function(){

$.ajax({
    url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
    type: 'GET',
    data: {
      apikey: asd,
      format: 'jsonp',
      track_id: giveLyricID
    },
    dataType: 'jsonp',
    success: function(result){
      $('.lyricHelp').html('');
      $('.lyrics').html('');
      var chosenLyric = result.message.body.lyrics.lyrics_body;
       var copyrightLyric = result.message.body.lyrics. lyrics_copyright;


      console.log(chosenLyric);

      $('.lyrics').html('<div class="myLyrics">'+chosenLyric + '</div>').append(copyrightLyric);
      console.log(result);
    }
  });

}// enf of lyrics get


}; // end of acapella


