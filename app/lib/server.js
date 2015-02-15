(function() {
  var API_PREFIX, express, http, path, requestHandlers, start, url;

  http = require('http');

  url = require('url');

  express = require('express');

  path = require('path');

  requestHandlers = require('./requestHandlers');

  API_PREFIX = '/api';

  start = function() {
    var app, config, project_dir, router;
    project_dir = (__dirname.split('/')).slice(0, -2).join('/');
    config = require(project_dir + '/config.js');
    app = express();
    router = express.Router();
    router.use(function(req, res, next) {
      console.log(req.method, req.url);
      return next();
    });
    router.use(express["static"](project_dir + '/app/bower_components'));
    router.use(express["static"](project_dir + '/app/public'));
    router.use(API_PREFIX, function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      return next();
    });
    router.route(API_PREFIX + '/photo').get((function(_this) {
      return function(req, res, next) {
        return requestHandlers.photo(req, res, config);
      };
    })(this));
    app.use('/', router);
    app.set('views', project_dir + '/app/public/views');
    app.set('view engine', 'jade');
    app.engine('html', require('ejs').renderFile);
    app.engine('jade', require('jade').__express);
    app.listen(8000);
    return console.log("Server running at " + app.host + ':' + app.port);
  };

  start();

}).call(this);
