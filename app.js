var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var documentdb = require("documentdb");
var config = require("./config"); 
var routes = require('./routes/index');
var querydb = require('./model/querydb');

//var users = require('./routes/users');

var app = express();
var obj = {};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);

//app.use('/', routes);
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});

//app.use('/', express.static(__dirname + '/index.html'));
//app.use('/users', users);
app.get('/compare-bike', function(req, res){
  

  console.log("compate-bike :"+obj.stations[0].id);
  for(var i = 0 ; i < obj.stations.length ; i++){
       querydb(obj.stations[i].id, function(err, results) {
        if(err) return console.log(err);
        // console.log(results.length);
        // console.log(typeof(results));
        // console.log('Query results:\n' + JSON.stringify(results, null, '\t') + '\n');
        // console.log('Query results:\n' + results[i].sna +'\n');
        console.log('Query results:\n' + results[1].sna +'\n');
        // res.render('compare-bike', { title: results[1].sna });


    });
       
   }
res.end();
//   querydb(obj.stations[0].id, function(err, results) {
//     if(err) return console.log(err);
//     console.log(results.length);
//     console.log(typeof(results));
//     // console.log('Query results:\n' + JSON.stringify(results, null, '\t') + '\n');
//     console.log('Query results:\n' + results[0].sna +'\n');
//     res.render('compare-bike', { title: results[0].sna });
//     // res.end();
// });
  
});


app.post('/users', function(req, res,next){
  // console.log('body POST: ' + req.body);
  // obj = req.body;
  // console.log(JSON.parse(obj));
  // res.end();
  obj = req.body;
  
  console.log('body: ' + JSON.stringify(req.body));
 //console.log('bobj: ' + obj[0].left_bikes);
  // res.end();
  res.send(JSON.stringify(req.body));

});

app.get('/users', function(req, res){
  console.log("GET METHOD");
  res.send(obj);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
