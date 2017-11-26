var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

module.exports = (passport) => {
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user) => {
            if (err) {
                console.log('ERROR logging in', err);
                return;
            }
            if (!user) {
                console.log('user doesnt exist');
                return;
            }
            req.logIn(user, (errr) => {
                if (errr) { return next(errr); }
                console.log('login successful', user.username);
            });
        })(req, res, next);
    });

    var isValidPassword = (user, password) => {
        return bCrypt.compareSync(password, user.password);
    };

    return router;
};