const createError = require('http-errors');
const express = require('express');

const User = require('../models/user');
const router = express.Router();

router.get('/:username', (req, res, next) => {
  User.findOne({username: req.params.username}, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(createError(404));
    }
    res.json({user: user});
  });
});

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username}, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      return next(createError(409, 'username이 이미 있습니다.'));
    }

    const newUser = new User({
      username: username,
      password: password
    });
    newUser.save();
    res.status(201).end();
  });
});

router.put('/', (req, res, next) => {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user.save(function (err) {
    if (err) {
      next(err);
      return;
    }
    res.json(req.user);
  });
});

module.exports = router;
