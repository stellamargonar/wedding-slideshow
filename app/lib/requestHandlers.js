(function() {
  var photo, querystring, request, require_helper, url;

  require_helper = require('./require_helper');

  url = require('url');

  querystring = require('querystring');

  request = require('request');

  photo = function(req, res, config) {
    var requestUrl;
    requestUrl = 'http://trycapsule.com/c/' + config.code + '/photos.json?access_token=' + config.access_token;
    return request.get(requestUrl, (function(_this) {
      return function(error, response, body) {
        var bodyObj, capsuleElement, date, photoList, photoObj, _i, _len;
        if (error || response.statusCode !== 200) {
          return res.send({
            error: error
          });
        } else {
          bodyObj = JSON.parse(body);
          photoList = [];
          for (_i = 0, _len = bodyObj.length; _i < _len; _i++) {
            capsuleElement = bodyObj[_i];
            date = Date.parse(capsuleElement.nice_original_date_time);
            photoObj = {
              capsule_id: capsuleElement.capsule_id,
              id: capsuleElement.id,
              type: capsuleElement.type,
              medium_url: capsuleElement.large_url,
              big_url: capsuleElement.original_url,
              timestamp: date
            };
            photoList.push(photoObj);
          }
          return res.send({
            result: photoList
          });
        }
      };
    })(this));
  };

  exports.photo = photo;

}).call(this);
