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


/* GET home page. */
router.get('/', function(req, res, next) {
   readJsonFile(__dirname+"/youbike.json", function (err, json) {
    if(err) { throw err; }
    //console.log(json);
   // res.sendFile(__dirname+"/youbike.json");
    res.render('index', { title: "youbike",jsonData:json});

    
  });
});

module.exports = router;
