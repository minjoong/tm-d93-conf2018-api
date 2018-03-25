const express = require('express');

const User = require('../models/user');
const router = express.Router();

router.get('/', function (req, res, next) {
  User.find()
    .sort({createdAt: 'descending'})
    .exec(function (err, users) {
      if (err) {
        return next(err);
      }
      res.json({users: users});
    });
});

module.exports = router;
