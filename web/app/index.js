;(function () {

  /** Model */

  var follow = require('../assets/follow.js/follow.js');

  var model = {
    path: '',
    package: {}
  };

  var follower = follow(model);

  follower.follow('path', function (path) {
    $('#path').val(path);
  });

  /** Controller */

  var ctrl = {
    switch: function (path) {
      $.ajax({
        url: '/api/switch',
        type: 'POST',
        data: { path: path }
      });
    }
  };

  /** View */

  $('#path').on('keyup', function () {
    model.path = $(this).val();
  });

  $('#path').on('change', function () {
    ctrl.switch($(this).val());
  });

})();
