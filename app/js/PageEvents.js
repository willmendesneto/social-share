/* globals alert, console, define, module */
(function(window, $) {
  'use strict';

  /**
   * @type {Object}
   */
  var PageEvents = {};

  PageEvents = {
    keyDownOpts: [],

    getKeydownValues: function(key){
      var listKeydown = false,
          keydownLength = this.keyDownOpts.length
      ;
      for (var i = 0; i < keydownLength; i++) {
        if(PageEvents.keyDownOpts[i].keyCode === key) {
          listKeydown = PageEvents.keyDownOpts[i];
        }
      }
      return listKeydown;
    },

    addKeydownEvents: function(opts) {
      this.keyDownOpts.push(opts);
      return this;
    },

    listeningEvents: function() {
      document.addEventListener('keydown', function(e) {
        e.preventDefault();
        var keyDownOption = PageEvents.getKeydownValues(e.keyCode);
        if ( typeof keyDownOption === 'object' ) {
          keyDownOption.callBack();
        }
      }, false);
    },

    /**
     * Simulate keyboard event based in params passed
     * @param  {int} keyCode value of keyCode
     * @return {[type]}         [description]
     */
    triggerKeyboardEvent: function(keyCode){
      var eventTrigger = $.Event('keydown');
      eventTrigger.keyCode = keyCode; // some value (f = 70)
      $(document).trigger(eventTrigger);
      console.log('Event trigger!');
    },
  };

  if (typeof define !== 'undefined' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return PageEvents;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageEvents.attach;
    module.exports.PageEvents = PageEvents;
  } else {
    window.PageEvents = PageEvents;
  }

})(window, window.Zepto);
