/* globals alert, console, define, module */
(function(window) {
  'use strict';

  var _video = {};

  /**
   * Init GetUserMedia API for render user video and capture image
   * @return {[type]} [description]
   */
  function Media(videoElement) {
    // Check if navigator object contains getUserMedia object.
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
    // Check if window contains URL object.
    window.URL = window.URL || window.webkitURL;

    this.apiExists = !!navigator.getUserMedia;
    _video = videoElement;
  }

  Media.prototype.initStream = function(options) {
    navigator.getUserMedia(options.streamSpecs, options.success || this.gotStream, options.error || this.noStream);
  }

  /**
   * Event fired in Stream error
   * @param  {[type]} err [description]
   * @return {[type]}     [description]
   */
  Media.prototype.noStream = function (err) {
    alert('Could not get camera stream.');
    console.log('Error: ', err);
  }

  /**
   * Event fired in Stream success
   * @param  {[type]} stream [description]
   * @return {[type]}        [description]
   */
  Media.prototype.gotStream = function(stream) {
    // Feed webcam stream to video element.
    // IMPORTANT: video element needs autoplay attribute or it will be frozen at first frame.
    // Store the stream.
    _video.src = (window.URL) ? window.URL.createObjectURL(stream) : stream;
    window.MediaSharedStream = stream;
  }



  if (typeof define !== 'undefined' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return Media;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Media.attach;
    module.exports.Media = Media;
  } else {
    window.Media = Media;
  }

})(window);
