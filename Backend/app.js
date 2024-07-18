var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {globalErrorHandler}=require('./Controllers/error.controllers.js')
const morganMiddleware= require("./middleware/morgan.middleware.js");

var app = express();

// Database connection 
const { connectToDB } = require('./Db/db.js');

// Ensure database connection before starting the server
connectToDB()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morganMiddleware);

app.use('/', indexRouter);
app.use('/api/users', usersRouter);





app.use(function(req, res, next) {
  next(createError(404));
});

app.use(globalErrorHandler);

module.exports = app;
