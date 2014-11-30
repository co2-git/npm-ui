module.exports = function () {

  var and = 'obj';

  var app, server;

  /** imbk-app server
   *
   *  @module server
   */

  if ( ! process.send ) {
    process.send = console.log;
  }

  /** @requires path */
  var path        =   require('path');
  /** @requires util */
  var format      =   require('util').format;
  /** @requires domain */
  var domain      =   require('domain').create();

  domain.on('error', function (error) {
    process.send('error', error);
    throw error;
  });

  domain.run(function () {
    
    /** *****************************************************************************************  **/

    var info        =   require('../package.json');
    var express     =   require('express');
    var bodyParser  =   require('body-parser');

    /** *****************************************************************************************  **/

    app = express();

    app.set('port',         +process.env.PORT || 3000);
    app.set('view engine',  'jade');
    app.set('views',        '..');

    /** *****************************************************************************************  **/

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    /** *****************************************************************************************  **/

    app.locals.info       =   {
      name:         info.name,
      version:      info.version
    };

    /** *****************************************************************************************  **/

    if ( app.get('env') === 'development' ) {
      app.locals.pretty = true;
    }

    /** *****************************************************************************************  **/
    /** Pre routing
    /** *****************************************************************************************  **/

    app.use(function (req, res, next) {
      res.locals.req = req;

      next();
    });

    /** *****************************************************************************************  **/
    /** Landing page
    /** *****************************************************************************************  **/

    app.get('/', function (req, res) {
      res.render(path.join(__dirname, '../web/index'));
    });

    /** *****************************************************************************************  **/
    /** API
    /** *****************************************************************************************  **/

    app.use('/api/:action', function (req, res, next) {
      require('./' + req.params.action)(req.body, function (error, response) {
        if ( error ) {
          return next(error);
        }
        res.json(response);
      });
    });

    /** *****************************************************************************************  **/
    /** Static router: images
    /** *****************************************************************************************  **/

    app.use('/images', express.static(path.join(__dirname, 'public/images')));

    /** *****************************************************************************************  **/
    /** Static router: css
    /** *****************************************************************************************  **/
    
    app.use('/css',
      function (req, res, next) {
        if ( app.get('env') === 'production' ) {
          req.url = req.url.replace(/\.css$/, '.min.css');
        }
        next();
      },
      express.static(path.join(__dirname, 'build/css')));

    /** *****************************************************************************************  **/
    /** Static router: javascript
    /** *****************************************************************************************  **/
    
    app.use('/js',
      function (req, res, next) {
        if ( app.get('env') === 'production' ) {
          req.url = req.url.replace(/\.js$/, '.min.js');
        }
        next();
      },
      express.static(path.join(__dirname, '../web/dist/js')));

    /** *****************************************************************************************  **/
    /** Static router: bower components
    /** *****************************************************************************************  **/

    app.use('/bower', express.static(path.join(__dirname, '../web/bower_components')))

    /** Error handler */

    app.use(function (error, req, res, next) {
      // process.send('error', error, error.stack);
      res.statusCode = 500;
      res.json({ error: {
        name: error.name,
        message: error.message,
        stack: error.stack.split(/\n/)
      } });
    });

    /** *****************************************************************************************  **/

    server = require('http').createServer(app);

    server.listen(app.get('port'), function () {
      process.send({ message: 'imbk server started', port: app.get('port'), pid: process.pid });
    });

    /** *****************************************************************************************  **/

    server.on('error', function (error) {
      throw error;
    });

    /** *****************************************************************************************  **/
  });

  return {
    app: app,
    server: server
  };
};
