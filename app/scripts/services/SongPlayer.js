(function () {
  function SongPlayer( $rootScope, Fixtures) {
    var SongPlayer = {};
    /**
    * @desc
    * @type
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Buzz object audio file
    *@type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */

    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        stopSong(SongPlayer.currentSong);
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });


      SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc Plays currentBuzzObject and sets the property of the song object to true
    * @param {Object} song
    */
    var playSong = function(song){
      song.playing = true;
      currentBuzzObject.play();
    }

    /**
    * @function stopSong
    * @desc Private function, Stops currentBuzzObject and sets the property of the song object to null
    * @param {Object} song
    */
    var stopSong = function(song){
      song.playing = null;
      currentBuzzObject.stop();
    }

    /**
    * @function getSongIndex
    * @desc Private Function, Gets the index of a Song
    * @param {Object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /**
    * @desc Active song object from list of songs
    * @type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    * @desc current song volume from 0 to 100
    * @type {Number}
    */
    SongPlayer.volume = 75;

    SongPlayer.muted = false;

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    /**
    * @function SongPlayer.play
    * @desc If buzz object song is not the same as current then a new song
    * will load and play. If the buzz object song is the same, and if the song is paused, then it will play
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentsong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong == song) {
        if (currentBuzzObject.isPaused()) {
          play(song);
        }
      }
    };

    /**
    * @function SongPlayer.pause
    * @desc Pauses the currently playing buzz object and sets song's playing attribute to false
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };


    /**
    * @function SongPlayer.previous
    * @desc Go to Previous song
    * @param
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        stopSong(SongPlayer.currentSong);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function SongPlayer.next
    * @desc Go to next song
    * @param
    */
    SongPlayer.next = function(){
      stopSong(SongPlayer.currentSong);
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex !== currentAlbum.songs.length) {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    SongPlayer.setVolume = function(volume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(volume);
      }
      SongPlayer.volume = volume;
    };

    SongPlayer.setMute = function() {
      if (SongPlayer.Volume === 0) {
        alert ("You have muted the volume!");
        SongPlayer.muted = false;

        SongPlayer.setVolume(SongPlayer.preVolume);
      } else {
          SongPlayer.preVolume = SongPlayer.volume;
          SongPlayer.muted = true;
          SongPlayer. setVolume(0);
      }
    }

    return SongPlayer;
  };



  angular
  .module('blocJams')
  .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
