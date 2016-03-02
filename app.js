var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');
var documentdb = require("documentdb");
var hbs = require('hbs'); 
var config = require("./config"); 
var routes = require('./routes/index');
var querydb = require('./model/querydb');
var jsonCircles = [
                    {
                      "x_axis": 30,
                      "y_axis": 30,
                      "radius": 20,
                      "color" : "green"
                    },
                    {
                      "x_axis": 70,
                      "y_axis": 70,
                      "radius": 20,
                      "color" : "purple"
                    }, 
                    {
                      "x_axis": 110,
                      "y_axis": 100,
                      "radius": 20,
                      "color" : "red"
                    }
                  ];


//var users = require('./routes/users');
var results_obj=[];
var app = express();
app.use(timeout('2h'));
var obj = {};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

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



app.post('/users', function(req, res,next){
  // console.log('body POST: ' + req.body);
  // obj = req.body;
  // console.log(JSON.parse(obj));
  // res.end();
  obj = req.body;
  
  console.log('body: ' + JSON.stringify(req.body));
 //console.log('bobj: ' + obj[0].left_bikes);
  // res.end();
  
       

  // res.send(JSON.stringify(req.body));
  // console.log("dfjklja;dlfj"+results);
  res.end();
  // res.send(results);
  // res.redirect('./');
  // next();
  // res.json()

});

app.get('/users', function(req, res){
  console.log("GET METHOD");
  res.send(results_obj);

});

app.listen(3000, 'localhost', function() {
    console.log("3000 ~ ~");
}).on('error', function(err){
    console.log('on error handler');
    console.log(err);
});


process.on('uncaughtException', function(err) {
    console.log('process.on handler');
    console.log(err);
});

app.use('/compare-bike',function(req,res,next){
  console.log("before use query........");
  console.log(obj.date);
  // async.waterfall([
  //      function(callback) {
  //       var findresult = 0;
  //       for(var i = 0 ; i < obj.stations.length ; i++){
  //         querydb.querydbFunc(obj.stations[i].id,"20160219",function(err,results){
  //           if(err) return console.log(err);
  //           results_obj.push(results);
  //           if (++inserted == collection.length) {
  //             callback();
  //           }


  //         });
  //       }
        
  //       // callback(null, 'one', 'two');
  //   }


  //   ],function(err,result){
  //     if(err) return console.log(err);
  //     console.log(result);
  //     // next();
  //   });
  var findresult = 0; 
  for(var i = 0 ; i < obj.stations.length ; i++){
       querydb.querydbFunc(obj.stations[i].id,obj.date,function(err, results) {
        if(err) return console.log(err);
        results_obj.push(results);
        // console.log("compare bike page:"+results[0].sna);
        console.log("query........");
        if(++findresult == obj.stations.length){
          next()
          console.log("go to Render.......");
        }
        // res.render('compare-bike', { title: results });
        //next();

    });

  }
  
  // console.log("use query........");
  // next();

});

app.get('/compare-bike', function(req, res){


  
  console.log("render........");
  console.log(results_obj);
  res.render('compare-bike', { title: results_obj});
  // res.end();

  
});

app.get('/d3_test', function(req, res){
  // res.render('index', { title: 'Express' });
  res.render('d3_test', {title:  jsonCircles});
  // res.end();
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
