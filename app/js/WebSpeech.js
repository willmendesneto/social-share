/* globals alert, console, define, module */
(function(window) {
  'use strict';

  var WebSpeech = {};

  // Our object that will hold all of the functions.
  WebSpeech = {
    browser: null,
    recognizing: false,
    voiceCommand: null,

    init: function(browser) {
      WebSpeech.browser = browser;
      WebSpeech.recognizing = false;
      if (WebSpeech.browser !== 'chrome') {
        return false;
      }

      WebSpeech.voiceCommand = new webkitSpeechRecognition();
      WebSpeech.voiceCommand.continuous = true;
      WebSpeech.voiceCommand.interimResults = true;
      WebSpeech.voiceCommand.lang = 'en';

      WebSpeech.voiceCommand.onstart = function() {
        WebSpeech.recognizing = true;
      };
      WebSpeech.voiceCommand.onend = function(){
        if(!WebSpeech.recognizing) {
          WebSpeech.recognizing = true;
          WebSpeech.voiceCommand.start();
        }
      };

      // Process the results when they are returned from the recogniser
      WebSpeech.voiceCommand.onresult =  function(e) {
        // Define a threshold above which we are confident(!) that the recognition results are worth looking at
        var confidenceThreshold = 0.5;
        var resultsLength = e.results.length;

        // Check each result starting from the last one
        for (var i = e.resultIndex; i < resultsLength; ++i) {

          // If this is a final result
          if (e.results[i].isFinal) {

            console.log('final result', parseFloat(e.results[i][0].confidence), parseFloat(confidenceThreshold));

            // If the result is equal to or greater than the required threshold
            if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
              var str = e.results[i][0].transcript;

              console.log('Recognised: ' + str);

              // If the user said 'foto' then app take a user picture
              if (WebSpeech.userSaid(str, 'self') || WebSpeech.userSaid(str, 'selfi') || WebSpeech.userSaid(str, 'selfie')) {
                PageEvents.triggerKeyboardEvent(13);
              }
            }
          }
        }
      };

      var self = this;
      setTimeout(function(){
        //começa reconhecimento de audio
        if(!self.recognizing) {
          self.startSpeechRecognition();
        }
      }, 3000);
    },

    /**
     * Start speech recognition
     * @return {[type]} [description]
     */
    startSpeechRecognition: function() {
      if(!this.recognizing) {
        this.voiceCommand.start();
      }
    },

    /**
     * Stop speech recognition
     * @return {[type]} [description]
     */
    stopSpeechRecognition: function() {
      this.voiceCommand.stop();
      this.recognizing = false;
      alert('not recognising');
    },

    /**
     * Simple function that checks existence of s in str
     * @param  {[type]} str [description]
     * @param  {[type]} s   [description]
     * @return {[type]}     [description]
     */
    userSaid: function(str, s) {
      return str.toLowerCase().indexOf(s.toLowerCase()) > -1;
    }
  }

  if (typeof define !== 'undefined' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return WebSpeech;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebSpeech.attach;
    module.exports.WebSpeech = WebSpeech;
  } else {
    window.WebSpeech = WebSpeech;
  }

})(window);
