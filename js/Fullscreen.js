/* globals alert, console, define, module */
(function(window) {
  'use strict';

  /**
   * Init Fullscreen API
   * @return {[type]} [description]
   */
  function Fullscreen(fullscreenEl){
    document.cancelFullScreen = document.webkitExitFullscreen || document.mozCancelFullScreen || document.exitFullscreen;
    this.fullscreenEl = document.querySelector(fullscreenEl);
  }

  /**
   * Toggle event for fullscreen
   * @param  {[type]} el [description]
   * @return {[type]}    [description]
   */
  Fullscreen.prototype.toggleFullScreen = function(el) {
    if (el.webkitEnterFullScreen) {
      el.webkitEnterFullScreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else {
      el.requestFullscreen();
    }
    el.ondblclick = this.exitFullscreen;
  }

  /**
   * Called whenever the browser exits fullscreen
   * @return {[type]} [description]
   */
  Fullscreen.prototype.onFullScreenExit = function() {
    console.log('Exited fullscreen!');
  }

  /**
   * Event fired on fullscreen activation
   * @return {[type]} [description]
   */
  Fullscreen.prototype.onFullScreenEnter = function() {
    this.fullscreenEl.onwebkitfullscreenchange = this.onFullScreenExit;
    this.fullscreenEl.onmozfullscreenchange = this.onFullScreenExit;
  };

  /**
   * Event fired for fullscreen enter
   * Note: FF nightly needs about:config full-screen-api.enabled set to true.
   * @return {[type]} [description]
   */
  Fullscreen.prototype.enterFullscreen = function() {
    this.fullscreenEl.onwebkitfullscreenchange = this.onFullScreenEnter;
    this.fullscreenEl.onmozfullscreenchange = this.onFullScreenEnter;
    this.fullscreenEl.onfullscreenchange = this.onFullScreenEnter;
    if (this.fullscreenEl.webkitRequestFullscreen) {
      this.fullscreenEl.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (this.fullscreenEl.mozRequestFullScreen) {
      this.fullscreenEl.mozRequestFullScreen();
    } else {
      this.fullscreenEl.requestFullscreen();
    }
  }

  /**
   * Event fired for exit fullscreen
   * @return {[type]} [description]
   */
  Fullscreen.prototype.exitFullscreen = function() {
    console.log('exitFullscreen()');
    document.cancelFullScreen();
  }

  /**
   * Export information for application via patterns
   *
   * - commonjs
   * - amd
   * - javascript default
   */
  if (typeof define !== 'undefined' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return Fullscreen;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Fullscreen.attach;
    module.exports.Fullscreen = Fullscreen;
  } else {
    window.Fullscreen = Fullscreen;
  }

})(window);
