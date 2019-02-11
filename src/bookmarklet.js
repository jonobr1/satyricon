javascript:(function() {

  var script = document.createElement('script');
  script.onload = function() {

    Transcode.ready(function() {

      var tags = document.querySelectorAll('p:not(.unavailable)');
      Transcode(tags);

    });

  };
  script.src = 'https://lost-and-found.gifts/src/transcode.js';
  document.body.appendChild(script);

})();
