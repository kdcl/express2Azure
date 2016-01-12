var express = require('express');
var request = require('request');

var zlib = require('zlib');
var router = express.Router();

var json;""
var options = {
  url: 'http://data.taipei/youbike',
  headers: {
    'content-type': 'application/json',
    'Accept-Encoding' : 'gzip, deflate',
  },
  encoding: null
};


request.get(options, function (error, response, body) {
 
  if (!error && response.statusCode == 200) {
    // If response is gzip, unzip first
    var encoding = response.headers['content-encoding']
    if (encoding && encoding.indexOf('gzip') >= 0) {
      zlib.gunzip(body, function(err, dezipped) {
        var json_string = dezipped.toString('utf-8');
        json = JSON.parse(json_string);
    } else {
      // Response is not gzipped
    }
  }
 
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "youbike",jsonData:json});
});

module.exports = router;
