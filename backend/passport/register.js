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
		 router.post('/register', (req, res) => {
 		 		// validation step
				 var newUser = new User({
					 username: req.body.username,
					 password: req.body.password,
				 });
				 console.log(newUser);
				 newUser.save((err, user) => {
					 if (err) {
						 console.log('error registering a user', err);
						 return;
					 }
					 console.log('registered', user);
				 });
 });

		 return router;
};

    // Generates hash using bCrypt, storing password safely
	    var createHash = (password) => {
	        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	    };
