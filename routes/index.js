var express = require('express');
var request = require('request');
var fs = require("fs");
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

function readJsonFile(filename, callback){
  fs.readFile(filename, function(err,data){
    if(err){
      callback(err);
      return;
    }
    try{
      callback(null, JSON.parse(data));
    }catch(exception){
      callback(exception);
    }
  });
}

request.get(options, function (error, response, body) {
 
  if (!error && response.statusCode == 200) {
    // If response is gzip, unzip first
    var encoding = response.headers['content-encoding']
    if (encoding && encoding.indexOf('gzip') >= 0) {
      zlib.gunzip(body, function(err, dezipped) {
        var json_string = dezipped.toString('utf-8');
        json = JSON.parse(json_string);
        // Process the json..
      });
    } else {
      // Response is not gzipped
    }
  }
 
});

/* GET home page. */
router.get('/', function(req, res, next) {
   readJsonFile('routes/youbike.json', function (err, json) {
    if(err) { throw err; }
    //console.log(json);
   // res.sendFile(__dirname+"/youbike.json");
    res.render('index', { title: "youbike",jsonData:json});

    
  });
});

module.exports = router;
