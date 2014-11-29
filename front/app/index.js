;(function () {

  var follow = require('../assets/follow.js/follow.js');

  var model = {
    path: ''
  };

  var follower = follow(model);

  follower.follow('path', function (path) {
    console.log(path);
  });

  setTimeout(function () {
    model.path = 'cool';
  });

})();
