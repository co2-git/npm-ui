;(function () {
  
  function follow (object) {

    var self = this;

    for ( var prop in object ) {
      this[prop] = object[prop];
    }

    this.__followers = {};

    if ( Object.observe ) {
      Object.observe(object, function (changes) {
        changes.forEach(function (change) {
          if ( self.__followers[change.name] ) {
            self.__followers[change.name].forEach(function (follower) {
              follower(change.object[change.name]);
            });
          }
        });
      });
    }
  }

  follow.prototype.follow = function(prop, follower) {
    if ( ! this.__followers[prop] ) {
      this.__followers[prop] = [];
    }
    this.__followers[prop].push(follower);
  };

  function _follow (object) {
    return new follow(object);
  }

  module.exports = _follow;

  return _follow;

})();
