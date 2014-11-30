;(function () {

  var follow = require('../assets/follow.js/follow.js');

  var model = {
    path: ''
  };

  var follower = follow(model);

  follower.follow('path', function (path) {
    $('#path').val(path);
  });

  $('#path').on('keyup', function () {
    model.path = $(this).val();
  });

})();
