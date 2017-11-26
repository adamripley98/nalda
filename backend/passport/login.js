var LocalStrategy   = require('passport-local');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

module.exports = (passport) => {
    // GET Login page
    router.get('/login', (req, res) => {
        console.log('goes into logiiinn');
    });

    // POST Login page
    // router.post('/login', passport.authenticate('local'), (req, res) => {
    //     console.log('log');
    // });
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
          if (err) {
            console.log('ERROR logging in', err);
            return;
          }
          if (!user) {
            console.log('user doesnt exist');
            return;
          }
          req.logIn(user, function(errr) {
            if (errr) { return next(errr); }
            // return res.redirect('/users/' + user.username);
            console.log('login successful', user.username);
          });
        })(req, res, next);
    });

    var isValidPassword = (user, password) => {
        return bCrypt.compareSync(password, user.password);
    };

    return router;
};
