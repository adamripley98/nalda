var LocalStrategy   = require('passport-local');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

module.exports = (passport) => {
	/* GET Registration Page */
    router.get('/register', (req, res) => {
				 console.log('does it even enter REGISTER???');
		 });

	/* Handle Registration POST */
		 router.post('/register', passport.authenticate('register', {
			 successRedirect: '/home',
			 failureRedirect: '/register',
			 failureFlash: true,
		 }));

		 return router;
};

    // Generates hash using bCrypt, storing password safely
	    var createHash = (password) => {
	        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	    };
