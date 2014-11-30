var path = require('path');

module.exports = function (options, cb) {

  var info = options;

  require('fs').stat(options.path, function (error, stat) {
    if ( error ) {
      return cb(null, info);
    }
    if ( ! stat.isDirectory() ) {
      return cb(new Error('Path must be a directory'));
    }
    info.stat = stat;
    require('fs').stat(path.join(options.path, 'package.json'),
      function (error, stat) {
        if ( stat ) {
          info.package = require(path.join(options.path, 'package.json'));
        }
        cb(null, info);
      });
  });
};
