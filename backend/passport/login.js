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
    router.post('/login', passport.authenticate('local'), (req, res) => {
        console.log('log');
    });

    var isValidPassword = (user, password) => {
        return bCrypt.compareSync(password, user.password);
    };

    return router;
};
