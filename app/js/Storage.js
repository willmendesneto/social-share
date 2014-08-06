/* globals alert, console, define, module */
(function(window) {
  'use strict';

  // Our object that will hold all of the functions.
  var loadCrypto = typeof CryptoJS !== 'undefined';

  function Storage(opts){
    this.secret = opts.secret;
    this.storageType = window[opts.storageType];
  }

  Storage.prototype.encrypt = function(object, secret) {
    var message = loadCrypto ? JSON.stringify(object) : object;
    return loadCrypto ? CryptoJS.TripleDES.encrypt(message, secret) : JSON.stringify(object);
  }

  Storage.prototype.decrypt = function(encrypted, secret) {
    if (typeof encrypted === 'undefined') {
      return '';
    }
    var decrypted = loadCrypto ? CryptoJS.TripleDES.decrypt(encrypted, secret) : JSON.parse(encrypted);
    return loadCrypto ? JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)) : decrypted;
  }

  Storage.prototype.get = function(key) {
    var encrypted = this.storageType.getItem(key);
    return encrypted && this.decrypt(encrypted, this.secret);
  }

  Storage.prototype.set = function(key, object) {
    if (!object) {
      this.remove(key);
      return false;
    }

    var encrypted = this.encrypt(object, this.secret);
    this.storageType.setItem(key, encrypted);
    return true;
  }

  Storage.prototype.remove = function(key) {
    this.storageType.removeItem(key);
    return true;
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
      return Storage;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage.attach;
    module.exports.Storage = Storage;
  } else {
    window.Storage = Storage;
  }

})(window);
