http        = require 'http'
url         = require 'url'
express     = require 'express'
path        = require 'path'
requestHandlers = require './requestHandlers'

API_PREFIX = '/api'

start = () ->
    project_dir = ((__dirname.split '/')[.. -3] ).join '/'
    config = require(project_dir + '/config.js')

    app = express()

    # configure routes
    router = express.Router();
    
    # log to console every request
    router.use (req, res, next) ->
        console.log req.method , req.url
        next()

    # static resources
    router.use express.static project_dir + '/app/bower_components'
    router.use express.static project_dir + '/app/public'

    # access control header
    router.use API_PREFIX , (req, res, next) ->
        res.setHeader 'Access-Control-Allow-Origin', 'http://localhost:8000'
        res.setHeader 'Access-Control-Allow-Methods', 'GET'
        res.setHeader 'Access-Control-Allow-Headers', 'X-Requested-With,content-type'
        next()

    # serve api
    router.route API_PREFIX + '/photo'
        .get (req, res, next) =>
            requestHandlers.photo req, res, config

    app.use '/', router

    # configure app
    app.set 'views' , project_dir + '/app/public/views'
    app.set 'view engine', 'jade'
    app.engine('html', require('ejs').renderFile);
    app.engine('jade', require('jade').__express);


    app.listen(8000)

    # Put a friendly message on the terminal
    console.log "Server running at " + app.host + ':' + app.port


start()