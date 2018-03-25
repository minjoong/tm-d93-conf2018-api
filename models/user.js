const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  emailConfirmationKey: {type: String, default: () => Math.random().toString(36).substring(2)},
  isEmailConfirmed: {type: Boolean, default: false},
  engName: String,
  korName: String,
  phone: String,
  communicationLevel: String,
  leadershipLevel: String,
  clubs: [String],
  roleInClub: String,
  roleInDistrict: String,
  conferencePlan: String,
  depositorName: String,
  handicapped: String,
  vipDinner: Boolean
});

const noop = () => {
};

userSchema.pre('save', function (done) {
  const user = this;

  if (!user.isModified('password')) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      return done(err);
    }
    bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
      if (err) {
        return done(err);
      }
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
