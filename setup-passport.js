const createError = require('http-errors');
const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new Strategy(opts, (payload, done) => {
  if (payload.email) {
    return done(null, {
      email: payload.email
    });
  } else {
    return done(createError(401, 'User not found'), null);
  }
}));
