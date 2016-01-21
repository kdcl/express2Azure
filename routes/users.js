var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));
  //res.send(req.body);
});


router.post('/', function(req, res, next) {
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));
  res.send(req.body);
});
module.exports = router;
