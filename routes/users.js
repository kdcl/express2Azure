var express = require('express');
var router = express.Router();
var obj = {};
/* GET users listing. */

// router.get('/', function(req, res, next) {
//   var obj = {};
//  console.log('body_GET: ' + JSON.stringify(req.body));
//   // res.send(req.body);
//    res.render('users',{title: 'FuckAjax_GET'});

// });


router.post('/', function(req, res, next) {
  
  console.log('body_POST: ' + JSON.stringify(req.body));
  
  obj = req.body;


  // res.send("fcuckds"+req.body);
  //next();
  //res.render('users',{title: 'FuckAjax_POST'});
});

// router.get('/', function(req, res, next) {
//   console.log('body_GET: ' + obj);
//   // res.send(req.body);
//   res.render('users',{title: 'FuckAjax_GET'});

// });

module.exports = router;
