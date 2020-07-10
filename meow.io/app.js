var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var factRouter = require('./routes/fact');
var db = require('./data/db.js');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});
const UPLOAD_QUEUE_KEY = "upload_queue_key";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/fact', factRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

setInterval(async () => {
  console.log("Time to save images to db!");
  let img;
  do {
    img = await new Promise(resolve => {
      client.lpop(UPLOAD_QUEUE_KEY, (err, reply) => {
        resolve(reply);
      });
    });
    if (img) {
      console.log("Saving an image");
      await db.cat(img);
    }
  } while (img != null);
}, 100);

module.exports = app;
