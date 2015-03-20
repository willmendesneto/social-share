/* globals alert, console, define, module */
(function(window) {
  'use strict';

  /**
   * APIS Useds for it
   *   Web Storage
   *   Offline
   *   Network Information API (http://www.w3.org/TR/netinfo-api/)
   * @type {Object}
   */
  var Network = {},
      Storage = new window.Storage({secret: 'storage-secret-key', storageType: 'localStorage'})
  ;

  Network = {
    hasInternet: null,
    init: function(){
      this.hasInternet = this.isConnected();
      window.addEventListener('offline', function(e) {
        // we just lost our connection and entered offline mode, disable eternal link
        Network.hasInternet = false;
      }, false);

      window.addEventListener('online', function(e) {
        // just came back online, enable links
        Network.hasInternet = true;
      }, false);
    },

    isConnected: function() {
      return !!(navigator && navigator.onLine);
    },

    /**
     * Verification for send image with high quality or not
     * @return {Boolean} [description]
     */
    isAFastConnection: function(){
      if (!this.hasInternet) {
        return false;
      }

      // create a custom object if navigator.connection isn't available
      var connection = navigator.connection || {'type': 0 };

      if (connection.type === 2 || connection.type === 1) {
        //wifi/ethernet
        //Coffee Wifi latency: ~75ms-200ms
        //Home Wifi latency: ~25-35ms
        //Coffee Wifi DL speed: ~550kbps-650kbps
        //Home Wifi DL speed: ~1000kbps-2000kbps
        return true;
      } else if (connection.type === 3) {
        //edge
        //ATT Edge latency: ~400-600ms
        //ATT Edge DL speed: ~2-10kbps
        return false;
      } else if (connection.type === 2) {
        //3g
        //ATT 3G latency: ~400ms
        //Verizon 3G latency: ~150-250ms
        //ATT 3G DL speed: ~60-100kbps
        //Verizon 3G DL speed: ~20-70kbps
        return false;
      } else if (connection.type === 0) {
        return false;
      } else {
        //unknown
        return true;
      }
    }
  };

  if (typeof define !== 'undefined' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return Network;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Network.attach;
    module.exports.Network = Network;
  } else {
    window.Network = Network;
  }

})(window);
