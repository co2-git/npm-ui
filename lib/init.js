var path = require('path');

function checkIfDirExists (dir, cb) {
  require('fs').stat(dir, cb);
}

function mkdir (dir, cb) {
  require('fs').mkdir(dir, function (error) {
    if ( error ) {
      return cb(error);
    }
    require('fs').stat(dir, cb);
  });
}

function init (dir, cb) {
  var package = {
    name: path.basename(dir),
    version: '0.0.0'
  };

  var stream = require('fs').createWriteStream(path.join(dir, 'package.json'));

  stream.write(JSON.stringify(package, null, 2));

  stream.end();

  stream.on('finish', function () {
    cb(null, package);
  });
}

module.exports = function (options, cb) {

  var info = options;

  checkIfDirExists(options.path, function (error, stat) {
    if ( error ) {
      return mkdir(options.path, function (error, stat) {
        if ( error ) {
          return cb(error);
        }

        info.stat = stat;

        init(options.path, function (error, package) {
          if ( error ) {
            return cb(error);
          }

          info.package = package;

          cb(null, info);
        });
      });
    }

    info.stat = stat;

    init(options.path, function (error, package) {
      if ( error ) {
        return cb(error);
      }

      info.package = package;

      cb(null, info);
    });
  });
};
