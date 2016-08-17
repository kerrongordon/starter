const $ = require('jquery');

(function(){
  "use strict";

  var notification = function() {
    $('.notification__close').click(function() {
      $('.notification').removeClass('notification__open');
      console.log('click');
    });

    $('.test').addClass('notification__open');
    console.log('kgp');
  };

  notification();

})();
