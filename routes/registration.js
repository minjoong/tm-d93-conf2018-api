const createError = require('http-errors');
const express = require('express');

const User = require('../models/user');
const router = express.Router();

router.post('/:email/registration', async (req, res, next) => {
  const user = req.user;
  if (user.isRegistered) {
    return next(createError(409, '이미 참가 등록을 완료하였습니다.'));
  }
  const registration = {};
  registration.engName = req.body.engName;
  registration.korName = req.body.korName;
  registration.phone = req.body.phone;
  if (req.body.communicationLevel !== '') {
    registration.communicationLevel = req.body.communicationLevel;
  }
  if (req.body.leadershipLevel !== '') {
    registration.leadershipLevel = req.body.leadershipLevel;
  }
  registration.clubs = req.body.clubs;
  registration.roleInClub = req.body.roleInClub;
  registration.roleInDistrict = req.body.roleInDistrict;
  registration.conferencePlan = req.body.conferencePlan;
  registration.depositorName = req.body.depositorName;
  registration.handicapped = req.body.handicapped;
  registration.vipDinner = req.body.vipDinner;
  user.registration = registration;
  user.isRegistered = true;
  try {
    const savedUser = await user.save();
    return res.json(savedUser.registration);
  } catch (err) {
    return next(err);
  }
});

router.put('/:email/registration', async (req, res, next) => {
  const user = req.user;
  if (!user.isRegistered) {
    return next(createError(409, '참가 등록을 먼저 진행해야 수정할 수 있습니다.'));
  }
  const registration = user.registration;
  registration.engName = req.body.engName;
  registration.korName = req.body.korName;
  registration.phone = req.body.phone;
  registration.communicationLevel = req.body.communicationLevel;
  registration.leadershipLevel = req.body.leadershipLevel;
  registration.clubs = req.body.clubs;
  registration.roleInClub = req.body.roleInClub;
  registration.roleInDistrict = req.body.roleInDistrict;
  registration.conferencePlan = req.body.conferencePlan;
  registration.depositorName = req.body.depositorName;
  registration.handicapped = req.body.handicapped;
  registration.vipDinner = req.body.vipDinner;
  try {
    const savedUser = await user.save();
    return res.json(savedUser.registration);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
