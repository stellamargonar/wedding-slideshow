require_helper = require './require_helper'
url = require 'url'
querystring = require 'querystring'
request = require 'request'

photo = (req, res, config) ->
    requestUrl = 'http://trycapsule.com/c/' + config.code + '/photos.json?access_token=' + config.access_token

    request.get requestUrl, (error, response, body) =>

        if error or response.statusCode isnt 200
            res.send {error: error}
        else
            # filter fields

            bodyObj = JSON.parse body
            photoList = []

            for capsuleElement in bodyObj
                date = Date.parse(capsuleElement.nice_original_date_time)

                photoObj = 
                    capsule_id  : capsuleElement.capsule_id
                    id          : capsuleElement.id
                    type        : capsuleElement.type
                    medium_url  : capsuleElement.large_url
                    big_url     : capsuleElement.original_url
                    timestamp   : date

                photoList.push photoObj

            res.send {result: photoList}

        
exports.photo = photo;