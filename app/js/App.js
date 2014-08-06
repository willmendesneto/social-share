/* globals alert, console, define, module */
(function(window) {
  'use strict';

  // Our object that will hold all of the functions.
  var App = {}, Fullscreen, WebSpeech;

  App = {
    options: {
      idConfigPage: null,
      video: '#video',
      canvas: '#canvas'
    },

    initialized: false,
    // Get the video element.
    video: null,
    // Get the canvas element.
    canvas: null,
    // Get the canvas context.
    ctx: null,
    // This will hold the screenshot base 64 data url.
    dataURL: null,

    countDown: 6,

    browser: null,

    FB: null,

    opts: {
      facebook: {
        accessToken: null,
        userInfo: null
      }
    },

    listFiles: [{
        filename: 'facebook',
        url: '//connect.facebook.net/pt_BR/all.js'
      },{
        filename: 'facebook-debug',
        url: '//connect.facebook.net/pt_BR/sdk/debug.js',
    }],

    /**
     * Init class
     * @return {[type]} [description]
     */
    initialize: function() {

      if (this.initialized) {
        return;
      }

      this.browserVerification();
      this.video = document.querySelector(this.options.video);
      // Get the canvas element.
      this.canvas = document.querySelector(this.options.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.initialized = true;

      this.build();

    },

    browserVerification: function(){
      var browser = navigator.userAgent.toLowerCase();
      if(/chrome/.test(browser)){
        this.browser = 'chrome';
      } else if (/mozilla/.test(browser)) {
        this.browser = 'mozilla';
      } else {
        alert('Seu navegador não suporta as API\'s utilizadas nesta aplicação.');
      }
    },

    /**
     * Load all list files in application
     * @return {[type]} [description]
     */
    loadAsyncListFiles: function(){
      var listFiles = this.listFiles, key;
      for(key in listFiles){
        this.loadAsyncFile(listFiles[key]);
      }
    },

    /**
     * Load files async in application
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */
    loadAsyncFile: function(file){
      (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {
            return;
          }
          js = d.createElement(s);
          js.id = id;
          js.src = file.url ;
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', file.filename));
    },

    build: function(){
      this.loadAsyncListFiles();
      this.initGetUserMedia();
      this.initFullScreen();
      this.initFB();

      this.initPageEvents();
      this.initAPIsByBrowser();
    },

    initAPIsByBrowser:  function() {
      var browser = this.browser.charAt(0).toUpperCase() + this.browser.substr(1);
      this['init' + browser + 'Apis']();
    },

    initChromeApis:  function() {
      this.initSpeechRecognition();
    },

    initMozillaApis:  function() {
      this.initBatteryStatus({batteryStatusVerification: true, verificationInterval: 100000});
    },

    initNetwork: function() {
      Network.init();
    },

    /**
     * Init facebook content
     * @return {[type]} [description]
     */
    initFB: function(){
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '1497738640438716', /*// App ID*/
          status     : true, /*// check login status*/
          cookie     : true, /*// enable cookies to allow the server to access the session*/
          xfbml      : true  /*// parse XFBML*/
        });

        //  Dependency Injection
        App.FB = FB;

        /* Verificando se o usuario ja esta cadastrado no sistema pelo facebook */
        App.fbGetLoginStatus();

      };
    },

    /**
     * Get Facebook Status Login
     * @return {[type]} [description]
     */
    fbGetLoginStatus: function(){
      this.FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          if (!!response.authResponse.accessToken) {
            //  Get user informations
            App.fbGetUserInfo();
            //  Get access token
            App.opts.facebook.accessToken = response.authResponse.accessToken;
          }
          console.log('Logged in.');
        } else {
          App.fbLogin();
        }
      });
    },

    // Convert a data URI to blob
    dataURItoBlob: function(dataURI) {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {
        type: 'image/png'
      });
    },

    createFormData: function(opts, dataURL){

      var blob;
      try {
          blob = this.dataURItoBlob(dataURL);
      } catch (e) {
          console.log(e);
      }
      var formParams = new FormData();
      formParams.append('access_token', opts.pageAccessToken);
      formParams.append('source', blob);
      formParams.append('message', opts.message);
      return formParams;
    },

    /**
     * Facebook Login
     * @return {[type]} [description]
     */
    fbLogin: function(opts){
      var fbOptsScope = {
        scope: 'email,user_photos,user_videos,friends_photos,user_photo_video_tags,friends_photo_video_tags,manage_pages,publish_actions'
      };

      if (typeof opts === 'object' && !!opts.likes) {
        fbOptsScope.scope += 'user_likes';
      }

      this.FB.login(function(response) {
        if (response.authResponse) {
          console.log(response.authResponse.accessToken);
          //  Get access token
          App.opts.facebook.accessToken = response.authResponse.accessToken;
          //  Get user informations
          App.fbGetUserInfo();
        }
      }, fbOptsScope);
    },

    /**
     * Get user informations at facebook
     * @return {[type]} [description]
     */
    fbGetUserInfo: function() {
      this.FB.api('/me', function(user) {
        App.opts.facebook.userInfo = user;
      });
    },

    fbSendPhotoFromTimeline: function(dataURL){
      var pageAccessToken = App.FB.getAccessToken();
      var opts = {
        postUrl: 'https://graph.facebook.com/me/photos?access_token=' + pageAccessToken,
        pageAccessToken: pageAccessToken,
        message: 'TDC 2014 - Trilha Frontend =).'
      };

      var params = this.createFormData(opts, dataURL);

      /* make the API call */
      $.ajax({
        url: opts.postUrl,
        type: 'POST',
        data: params,
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {
          console.log(response);
          alert('Foto enviada para o Facebook!');
        },
        error: function (shr, status, data) {
          console.log('Something is wrong ' + data + ' Status ' + shr.status);
        },
        complete: function () {
          console.log('photo already sent for fanpage album!');
        }
      });
    },

    /**
     * Init Speech recognition API for voice command
     * @return {[type]} [description]
     */
    initSpeechRecognition: function(){
      WebSpeech = window.WebSpeech;
      WebSpeech.init(this.browser);

      console.log('WebSpeech');
      console.log(WebSpeech);
    },

    /**
     * Init Fullscreen API
     * @return {[type]} [description]
     */
    initFullScreen: function(){
      Fullscreen = new window.Fullscreen('#video-content');
    },

    initPageEvents: function() {
      PageEvents.addKeydownEvents({
          keyCode: 13,
          callBack: function(){
            App.capturePhoto();
          }
        })
        .addKeydownEvents({
          keyCode: 70,
          callBack: function(){
            Fullscreen.enterFullscreen();
          }
        });

      PageEvents.listeningEvents();
    },

    /**
     * Init GetUserMedia API for render user video and capture image
     * @return {[type]} [description]
     */
    initGetUserMedia: function(){

      var Media = new window.Media();
      // Check for getUserMedia support.
      if (Media.apiExists) {
        // Get video stream.
        Media.initStream({
          streamSpecs: {
            video: true
          }
        });
      } else {
        // No getUserMedia support.
        alert('Your browser does not support getUserMedia API.');
      }
    },

    /**
     * Capture user photo
     * @return {[type]} [description]
     */
    capturePhoto: function () {
      this.countDownPhoto(document.querySelector('.countdown-photo'));
    },

    countDownPhoto: function($countDownPhoto){
      var  $self = this;
      var intervalo = setInterval(function(){
        $countDownPhoto.innerHTML = parseInt($self.countDown) - 1;
        if ($self.countDown === 0) {
          $self.capture();
          $self.countDown = 6;

          App.toggleFlashClassNameEffect();

          $countDownPhoto.innerHTML = 'OK';
          setTimeout(function(){
            $countDownPhoto.innerHTML = '';
          }, 2000);

          clearInterval(intervalo);
        } else {
          $self.countDown = --$self.countDown;
        }
      }, 1000);
    },

    /**
     * Simulate camera flash event
     * @return {[type]} [description]
     */
    toggleFlashClassNameEffect: function(){
      var $el = document.querySelector('.flash-effect'),
          $canvasImage = document.querySelector('.canvas-image')
      ;
      $el.classList.add('active');
      $canvasImage.classList.add('hide');

      setTimeout(function(){
        $el.classList.remove('active');
        $canvasImage.classList.remove('hide');

        document.querySelector('.countdown-photo').innerHTML = 'OK';
      }, 600);
    },

    /**
     * [initBatteryStatus description]
     * @param  {[type]} opts Object {batteryStatusVerification: true, verificationInterval, 100000}
     * @return {[type]}      [description]
     */
    initBatteryStatus: function(opts){
      Battery(opts);
    },

    /**
     * Capture frame from live video stream
     * @return {[type]} [description]
     */
    capture: function () {
      var $self = this;

      // Check if has stream.
      if (window.MediaSharedStream) {
        // Draw whatever is in the video element on to the canvas.
        $self.ctx.drawImage($self.video, 0, 0);
        //  Get image quality based in connection
        var imageQuality = !!Network.isAFastConnection() ? 100 : 72;
        // Create a data url from the canvas image.
        App.dataURL = $self.canvas.toDataURL('image/png', imageQuality);
        console.log(App.dataURL);
        // Call our method to save the data url to an image.
        if (Network.isConnected()) {
          $self.fbSendPhotoFromTimeline(App.dataURL);
        } else {
          $self.localStore(App.dataURL);
        }
      }
    },

    localStore: function(dataURL) {
      Storage = new Storage({secret: 'tdc-2014', storageType: 'localStorage'});
      var photos = Storage.get('photos');
      if (!photos) {
        photos = [];
      }
      photos.push({photo: dataURL});
      Storage.set('photos', photos);
      alert('Foto armazenada localmente.');
    },

  };

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
      return App;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = App.attach;
    module.exports.App = App;
  } else {
    window.App = App;
  }

})(window);
