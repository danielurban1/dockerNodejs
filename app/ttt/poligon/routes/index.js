var express = require('express');
var router = express.Router();

router.all('*', function(req, res, next) {
  res.locals.currentrouting = "Index routing";
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'aaa' });
});

module.exports = router;
