const config = require('config')
const createError = require('http-errors');
const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');

const User = require('./models/user');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwt.secret;

passport.use(new Strategy(opts, async (payload, done) => {
  try {
    const user = await User.findOne({email: payload.email});

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));
