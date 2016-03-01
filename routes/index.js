var express = require('express');
var request = require('request');
var fs = require("fs");
var zlib = require('zlib');
var querydb = require('../model/querydb');
var router = express.Router();
var totalnum = 1;

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
          totalnum+=1;
          fs.writeFile( __dirname+"/../public/javascripts/0301/YouBikeTP_"+totalnum+".json", json_string,function(err){
            if(err) console.log(err);
            console.log("get File"); 
            // querydb.createdocumentFunc();
          });
          
          // querydb.createdocumentFunc();

        });
      } else {
        // Response is not gzipped
        console.log("Response is not gzipped");
      }
    }
   
  });
}

setInterval(get_youbikeUpdate, 1000*60*10);//1000*60*1
// setInterval(writedatatodb, 1000*60*10);//1000*60*1
// writedatatodb();
// var i = 0;
// var total;
// setInterval(function() {
//     i++;
//     console.log('still alive!' + i);
// }, 1000);

// function writedatatodb(){
//   i++;
//   total = i*5;
//   querydb.countCloseTimer();
//   console.log('still alive!' + total);
  
// }
function writedatatodb(){
  querydb.createdocumentFunc();
  
}


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
