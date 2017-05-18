(function(window, $) {
  'use strict';

  /**
   *  Calling fastclick in application
   */
  var FastClick = window.FastClick || {},
    // Initialize our application.
    App = window.App || {}
  ;

  // Initialize our application.
  App.initialize();
  // Initialize Fastclick component
  FastClick.attach(document.body);

  var $triggerEvent = $('.trigger-event');

  if (UA.isMobile() || UA.isTablet()) {
    document.querySelector('.canvas-image').classList.add('mobile');
    $triggerEvent.bind('click', function(){
      PageEvents.triggerKeyboardEvent(parseInt($(this).data('key')));
    });
  } else {
    $triggerEvent.remove();
  }

})(window, window.Zepto);
