var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/aaa', function(req, res, next) {
	
	res.write("bleble1");
	res.end();

});

router.get('/home', function(req, res, next) {
	
    res.render('index', { title: 'bdfbcvbcv', 'ver' : 120 });

});

module.exports = router;
