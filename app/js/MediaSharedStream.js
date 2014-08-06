(function(window) {
  var MediaSharedStream = null;

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
      return MediaSharedStream;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaSharedStream.attach;
    module.exports.MediaSharedStream = MediaSharedStream;
  } else {
    window.MediaSharedStream = MediaSharedStream;
  }

})(window);
