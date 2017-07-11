var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var mysql = require('mysql');

var index = require('./routes/index');
var users = require('./routes/users');
var poligon = require('./routes/poligon');
var abc = require('./routes/abc');
var user = require('./routes/user');



var app = express();

var con = mysql.createConnection({
  host: "mydb1",
  user: "admin",
  password: "qqq"
});

con.query('SELECT author from poligon.posts', function(err, rows) { 
if (err) { console.error('error connecting: ' + err.stack); return; } 
console.log('connected!'); 
console.log(rows[0]);
}); 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('*', function(req, res, next) {
	req.started = process.hrtime();
	res.app.locals.verapp = 500;
	next();
});

app.use('/', index);
app.use('/users/', users);
app.use('/logs', poligon);
app.use('/abc', abc);
app.use('/user/', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
