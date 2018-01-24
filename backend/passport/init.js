// Import other backend files
const login = require('./login');
const register = require('./register');
const facebook = require('./facebook');

// Import user model
const User = require('../models/user');

/**
 * Initialize the passport routes
 */
module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    console.log('enters serialize');
    console.log('user in serialize', user);
    console.log('id in serialze', user._id);
    console.log('type', typeof user._id);
    const userId = user._id || user[0]._id;
    console.log('what is userId', userId);
    done(null, userId);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Setting up passport strategies for login & register
  login(passport);
  register(passport);
  facebook(passport);
};
