const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  emailConfirmationKey: {type: String, default: () => Math.random().toString(36).substring(2)},
  isEmailConfirmed: {type: Boolean, default: false},
  isRegistered: {type: Boolean, default: false},
  registration: {
    engName: String,
    korName: String,
    phone: String,
    communicationLevel: {type: String, enum: ['CC', 'ACB', 'ACS', 'ACG', 'DTM']},
    leadershipLevel: {type: String, enum: ['CL', 'ALB', 'ALS', 'DTM']},
    clubs: [String],
    roleInClub: String,
    roleInDistrict: String,
    conferencePlan: {type: String, enum: ['Early Bird', 'Regular', 'On-Site']},
    depositorName: String,
    handicapped: String,
    vipDinner: Boolean
  },
  roles: [String]
});

userSchema.pre('save', async function (done) {
  const user = this;

  if (!user.isModified('password')) {
    return done();
  }

  try {
    user.password = await bcrypt.hash(user.password, SALT_FACTOR);
    return done();
  } catch (err) {
    return done(err);
  }
});

userSchema.methods.checkPassword = function (guess) {
  return bcrypt.compareSync(guess, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
