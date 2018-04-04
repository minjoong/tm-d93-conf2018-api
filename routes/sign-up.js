const createError = require('http-errors');
const express = require('express');

const User = require('../models/user');
const router = express.Router();

router.post('/', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({email: email});
    if (user) {
      return next(createError(409, 'email이 이미 있습니다.'));
    }

    const newUser = new User({
      email: email,
      password: password
    });
    await newUser.save();

    return res.status(201).end();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
