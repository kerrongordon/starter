(function(){
  "use strict";

  let notification = () => {
    $('.notification__close').click(function() {
      $('.notification').removeClass('notification__open');
      console.log('click');
    });

    $('.test').addClass('notification__open');
    console.log('kgp');
  };

  notification();

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBub3RpZmljYXRpb24gPSAoKSA9PiB7XG4gICAgJCgnLm5vdGlmaWNhdGlvbl9fY2xvc2UnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICQoJy5ub3RpZmljYXRpb24nKS5yZW1vdmVDbGFzcygnbm90aWZpY2F0aW9uX19vcGVuJyk7XG4gICAgICBjb25zb2xlLmxvZygnY2xpY2snKTtcbiAgICB9KTtcblxuICAgICQoJy50ZXN0JykuYWRkQ2xhc3MoJ25vdGlmaWNhdGlvbl9fb3BlbicpO1xuICAgIGNvbnNvbGUubG9nKCdrZ3AnKTtcbiAgfTtcblxuICBub3RpZmljYXRpb24oKTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
