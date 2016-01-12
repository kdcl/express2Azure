var express = require('express');
var request = require('request');
var fs = require("fs");
var zlib = require('zlib');
var router = express.Router();

var json;
var options = {
  url: 'http://data.taipei/youbike',
  headers: {
    'content-type': 'application/json',
    'Accept-Encoding' : 'gzip, deflate',
  },
  encoding: null
};

function get_youbikeUpdate(){

request.get(options, function (error, response, body) {
 
  if (!error && response.statusCode == 200) {
    // If response is gzip, unzip first
    var encoding = response.headers['content-encoding']
    if (encoding && encoding.indexOf('gzip') >= 0) {
      zlib.gunzip(body, function(err, dezipped) {
        var json_string = dezipped.toString('utf-8');
        json = JSON.parse(json_string);
        fs.writeFile( __dirname+"/YouBikeTP.json", json_string);
      });
    } else {
      // Response is not gzipped
    }
  }
 
});
}

setInterval(get_youbikeUpdate, 1000*60*1);


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
/*
fs.watchFile(__dirname+"/YouBikeTP.json", function(curr,prev,res) {
    console.log("file Change");
    readJsonFile(__dirname+"/YouBikeTP.json", function (err, json) {
    if(err){ 
      throw err;
    }});
    res.render('index', { title: "Youbike",jsonData:json});
});
*/


/* GET home page. */
router.get('/', function(req, res, next) {
   readJsonFile(__dirname+"/YouBikeTP.json", function (err, json) {
    if(err) { throw err; }
    //console.log(json);
   // res.sendFile(__dirname+"/youbike.json");
    res.render('index', { title: "Youbike",jsonData:json});

    
  });
});
/*
router.post('/', function(req, res) {
    readJsonFile(__dirname+"/YouBikeTP.json", function (err, json) {
    if(err){ 
      throw err;
    }});
    res.render('index', { title: "Youbike",jsonData:json});
});
*/
module.exports = router;
