const createError = require('http-errors');
const express = require('express');

const User = require('../models/user');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const user = req.user;
  if (!user.roles.includes('admin')) {
    return next(createError(403));
  }
  try {
    const users = await User.find()
      .sort({createdAt: 'descending'});

    return res.json(users);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
