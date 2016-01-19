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
        fs.writeFile( __dirname+"/../public/javascripts/YouBikeTP.json", json_string);
        console.log("get File");
      });
    } else {
      // Response is not gzipped
      console.log("Response is not gzipped");
    }
  }
 
});
}

setInterval(get_youbikeUpdate, 1000*60*1);//1000*60*1


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

fs.watchFile(__dirname+"/../public/javascripts/YouBikeTP.json", function(curr,prev) {
    console.log("file Change");
    
});


/* GET home page. */
router.get('/', function(req, res, next) {
   /*
   readJsonFile(__dirname+"/YouBikeTP.json", function (err, json) {
    if(err) { throw err; }
      res.render('index', { title: "Youbike",jsonData:json});
    });
  */
//res.sendFile( __dirname + "/public/" + "googelmap.html" );    
    //res.sendFile(path.join(__dirname + '/public/googelmap.html'));

    //res.sendFile(__dirname+'/googelmap.html');
  //  res.render('index', { title: "Youbike",jsonData:json});
    res.render('index');
  
});

router.post('/', function(req, res) {
/*    readJsonFile(__dirname+"/YouBikeTP.json", function (err, json) {
    if(err){ 
      throw err;
    }});*/
     res.render('index');
});

module.exports = router;
