var login = require('./login');
var register = require('./register');
var User = require('../models/user');

/**
 * Initialize the passport routes
 */
module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Setting up passport strategies for login & Register
  login(passport);
  register(passport);
};
