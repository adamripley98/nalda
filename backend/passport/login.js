var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = (passport) => {
    console.log('hellllo from login.js');
  	passport.use('login', new LocalStrategy({
      passReqToCallback: true
  },
  (req, email, password, done) => {
      // check in mongo if a user with username exists or not
      console.log('2nd part of login.js');
      User.findOne({'email': email},
          (err, user) => {
              // In case of any error, return using the done method
              if (err) {
                  console.log('err logging in:', err);
                  return done(err);
              }
              // Username does not exist, log the error and redirect back
              if (!user) {
                  console.log('User Not Found with email ' + email);
                  return done(null, false, req.flash('message', 'User Not found.'));
              }
              // User exists but wrong password, log the error
              if (!isValidPassword(user, password)) {
                  console.log('Invalid Password');
                  return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
              }
              // User and password both match, return user from done method
              return done(null, user);
          }
              );
  }));

    var isValidPassword = (user, password) => {
        return bCrypt.compareSync(password, user.password);
    };
};
