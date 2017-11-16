var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        console.log('serializing user: ', user);
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            console.log('deserializing user:', user);
            done(err, user);
        });
    });

    // Setting up passport strategies for login & signup
    login(passport);
    signup(passport);
};
