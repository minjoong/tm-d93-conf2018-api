const bodyParser = require('body-parser');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
require('./setup-passport');

const usersRoutes = require('./routes/users');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const app = express();
mongoose.connect('mongodb://localhost:27017/tm-d93-conf2018');

app.use(cors());

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use(passport.authenticate('jwt', {session: false}));
app.use('/users', usersRoutes);
app.use('/user', userRoutes);

// 404 에러를 잡아서 에러 던진다.
app.use(function (req, res, next) {
  next(createError(404, 'Not Found'));
});

// 모든 에러를 로깅하는 미들웨어
app.use(function (err, req, res, next) {
  console.error(err);
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({message: err.message});
});

module.exports = app;
