// 외부 모듈
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const express = require('express');
// const {check, param, query, validationResult} = require('express-validator/check');
// const {matchedData, sanitize} = require('express-validator/filter');

// 모델
const User = require('../models/user');

const secret = 'secret';
const router = express.Router();

// auth token 요청을 처리한다.
// 1. body 에 포함된 email과 password가 일치하는 사용자를 찾는다.
// 2. 토큰(payload + 비밀키) 생성 및 전송
router.post('/', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(createError(422, '아이디나 비밀번호를 입력하지 않았습니다.'));
  }

  try {
    const user = await User.findOne({email: email});
    if (!user) {
      return next(createError(401, '아이디가 없습니다.'));
    }

    const isMatch = user.checkPassword(password);
    if (!isMatch) {
      return next(createError(401, '비밀번호가 틀렸습니다.'));
    }

    // 사용자 정보를 최종 전송할 때, 비밀번호는 가져오지 않는다.
    user.password = undefined;

    const payload = {
      email: user.email
    };

    const opts = {};
    opts.expiresIn = '1d';

    const token = jwt.sign(payload, secret, opts);

    return res.json({user:user, token:token});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
