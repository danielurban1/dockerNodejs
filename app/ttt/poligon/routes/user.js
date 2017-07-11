var express = require('express');
var router = express.Router();
var debug = require('debug')('poligon-users');
var uuid = require('uuid');
var mysql = require('mysql');
var Promise = require("promise");
var lo = require("lodash");


var login = "";
var pass = "";

var con = mysql.createConnection({
  host: "mydb1",
  user: "admin",
  password: "qqq"
});

router.all('*',
	injectTime,
	workTime,
	function(req, res, next) {
	res.locals.currentrouting = "Users routing";
	next();
});

router.get('/l/:id', function(req, res, next) {
  res.render('user', {output: req.params.id});
});
router.get('/l/:name', function(req, res, next) {
  res.render('user', {output: req.params.name});
});


router.post('/submit',
	checkExistID,
	//checkLoginAndPassword,
	function(req, res, next) {

   //waliduj2,
	/*var insert = new Promise(function(resolve, reject) {
		var post = JSON.stringify(req.body);
		var sql = "INSERT INTO poligon.posts (author, post) VALUES('name', '"+ req.body.id +"')";

		//console.log("sql", sql);

		con.query(sql, function(err, rows) {

				if (err) {
					//console.error('error connecting: ' + err.stack);
					var err = new Error('Error DB');
					err.status = 500;
					err.message = 'Error while inserting to DB.';
					//next(err);
					reject(err);
					//res.status(500).send("Blad bazy").end();
				};

				if (rows) {
					console.log('connected!');
					console.log(rows[0]);
					console.log("tt1", new Date().getTime());
				};

				if (!err) {
					console.log("tt2", new Date().getTime());
					//res.status(201).render('user', req.body);
					resolve(req.body);
				};
		});*/

	var insertPost = new Promise(function(resolve, reject) {

		var ins1 = "INSERT INTO poligon.posts (author, post) VALUES('name', '"+ req.body.id +"')";
		con.query(ins1, function(err, result) {
		
			if (err) {
				return reject(err);
			};


			if (!err) {
				console.log("insert", new Date().getTime());
				return resolve(result.insertId);
			};
		});
	});
	
	var selectPosts = new Promise(function(resolve, reject) {

		var sql2 = "select * from poligon.posts ORDER BY idposts DESC";
		con.query(sql2, function(err, rows) {
			
			if (err) {
				return reject(err);
			};


			if (!err) {
				console.log("tt2", new Date().getTime());
				return resolve(rows);
			};
	});

});


	Promise.all([insertPost, selectPosts]).then(function(ans){
        
		if (ans && ans[1]) {
			var records = ans[1];
		} else {
			var records = [];
		};
		if (req.body) req.body.list = records;
		if (req.body) req.body.norecord = (ans && ans[0]) ? ans[0] : 0;
		
		res.status(201).render('user', req.body);

	}).catch(function(err){
		var er = new Error('Error DB');
	    er.status = 500;
	    er.message = err;
		next(er);
	}).then(function(){
		console.log("Zawsze");
	});


});

/*router.post('/submit',
   checkExistID,
	checkLoginAndPassword,
   //waliduj2,
   function(req, res, next) {
	var post = JSON.stringify(req.body);
	//var sql = "INSERT INTO poligon.posts (author, post) VALUES('name', '"+ post.substring(7, post.length - 2) +"')";
	var sql = "INSERT INTO poligon.posts (author, post) VALUES('name', '"+ req.body.id +"')";

    //console.log("sql", sql);

	con.query(sql, function(err, rows) {

			if (err) {
				//console.error('error connecting: ' + err.stack);
				var err = new Error('Error DB');
				err.status = 500;
				err.message = 'Error while inserting to DB.';
				next(err);
				//res.status(500).send("Blad bazy").end();
			};

			if (rows) {
				console.log('connected!');
				console.log(rows[0]);
				console.log("tt1", new Date().getTime());
			};

			if (!err) {
				console.log("tt2", new Date().getTime());
				res.status(201).render('user', req.body);
			};
	});

});*/


router.get('/posts', function(req, res, next) {

var sql2 = "select * from poligon.posts ORDER BY idposts DESC";
	con.query(sql2, function(err, rows) {
			var html = "";
			if (err) {
				//console.error('error connecting: ' + err.stack);
				var err = new Error('Error DB');
				err.status = 500;
				err.message = 'Error while inserting to DB.';
				next(err);
				//res.status(500).send("Blad bazy").end();
			};


			if (!err) {
				console.log("tt2", new Date().getTime());
				res.status(201).render('user', {"list": rows});
			};
	});

});


router.post('/delete',
	//postExists,
	// //checkLoginAndPassword,
	// //waliduj2,
   function(req, res, next) {
	var post = JSON.stringify(req.body);
	console.log(typeof req.body.del);
	console.log(req.body.del);
	//var sql = "INSERT INTO poligon.posts (author, post) VALUES('name', '"+ post.substring(7, post.length - 2) +"')";
	// var posts = "";

	// var elements = lo.size(req.body.del.split(','));
	// // if (elements > 1)
	// for (var i = 0; i < elements; i++) {	
	// 	if (i + 1 === elements){
	// 		posts += elements[i] + "";
	// 	}
	// 	else{
	// 		posts += elements[i] + ", ";
	// 	}
	// };

	    //console.log("sql", sql);
	var sql = "delete from poligon.posts where idposts IN ("+ req.body.del +")";
		con.query(sql, function(err, rows) {

				if (err) {
					//console.error('error connecting: ' + err.stack);
					var err = new Error('Error DB');
					err.status = 500;
					err.message = 'Error while inserting to DB.';
					next(err);
					//res.status(500).send("Blad bazy").end();
				};

				if (rows) {
					console.log('connected!');
					console.log(rows[0]);
					console.log("tt1", new Date().getTime());
				};

				if (!err) {
					console.log("tt2", new Date().getTime());
					res.status(201).render('delete', req.body);
					
				};
		});


});


function checkExistID(req, res, next) {

debug("checkExistID", new Date().getTime());

  if (req.body && !req.body.id) {

    var err = new Error("nie ma wypelnionego id");
	err.status = 406;
    next(err);

  } else {

  next();

  }


};

function checkLoginAndPassword(req, res, next) {

debug("checkLoginAndPassword", new Date().getTime());

  if (req.body && req.body.password != "qqq") {

    var err = new Error("Niepoprawny login lub hasło");
	err.status = 406;
    next(err);

  } else {

  next();

  }


};
function postExists(req, res, next) {

	debug("checkExistID", new Date().getTime());
	var sql = "select idposts from poligon.posts where idposts = '" + req.body.del + "' limit 1";
	con.query(sql, function(err, rows) {
	
		if (err) {
			//console.error('error connecting: ' + err.stack);
			var err = new Error('Error DB');
			err.status = 500;
			err.message = 'Error while inserting to DB.';
			next(err);
					//res.status(500).send("Blad bazy").end();
				};
        
		if ( rows && rows[0] && rows[0]['idposts'] && (rows[0]['idposts'] == req.body.del) ){

		  	console.log(sql);
		    next();} 
	    else{
	    	var errorMessage = "Nie istnieje post o id " + ((req.body.del) ? req.body.del : 0);
			var err = new Error(errorMessage);
			err.status = 406;
			next(err);
		}
	});
};

 function waliduj2(req, res, next) {
  debug("waliduj2", new Date().getTime());

  if (req.body && !req.body.trick) {

    var err = new Error("nie wystarczajaca ilosc parametrow");
	err.status = 406;
    next(err);

  } else {
	  next();
  }


};


 function injectTime(req, res, next) {
	 debug("injectTime", new Date().getTime());

		 res.locals.time = new Date();

	 next();
 };


  function workTime(req, res, next) {

	 debug("workTime", new Date().getTime());

	 if (req.started) {
		 res.locals.elapsed = process.hrtime(req.started);
     }

	 next();
 };

module.exports = router;
