var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
app.options('*', cors());

const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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


// app.get('/parse', function(req, res) {
//   console.log('BOOOOM')
//   res.send('TEST')
// })

const parseUrl = 'https://felt.com';
const response = got(parseUrl).then((data) => {
  const url = data.redirectUrls.length > 0 ? data.redirectUrls[data.redirectUrls.length - 1] : parseUrl;
  const dom = new JSDOM(data.body);
  const result = dom.window.document.querySelectorAll(`meta[property='og:image']`);
  const thumbNail = result[0].content;

  const title = dom.window.document.querySelector('title').textContent;
  console.log(url);
  console.log(title);
  console.log(thumbNail);
});



module.exports = app;
