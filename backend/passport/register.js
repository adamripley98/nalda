var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

module.exports = (passport) => {
		 router.post('/register', (req, res) => {
			 // Ensure password meets validity conditions
			 if (isValidPassword(req.body.password, req.body.verPassword) !== 'success') {
				 res.send(isValidPassword(req.body.password, req.body.verPassword));
			 } else {
				 // Will attempt to find user in database
				 User.findOne({ 'username': req.body.username }, (err, user) => {
		     if (err) {
		         console.log('Error in SignUp: ' + err);
						 res.send('Unknown registration error');
						 return false;
		     }
	    	// User already exists
		     if (user) {
		         console.log('User already exists with username: ' + req.body.username);
						 res.send('User already exists.');
						 return false;
		     }
				 // If no error and user doesn't already exist, create a user
				 // Default sets userType to regular, admin can change to admin or editor
				 const newUser = new User({
					 username: req.body.username,
					 password: createHash(req.body.password),
					 userType: 'regular'
				 });
				 // Saving new user in Mongo
				 newUser.save((er, usr) => {
					 if (er) {
						 console.log('error registering a user', er);
						 res.send('Unknown registration error');
						 return false;
					 }
					 req.login(usr, (e) => {
						 if (e) console.log('error', e);
						 res.send(usr);
					 });
					 return true;
				 });
		 });
 }
	 });
			 return router;
};

// Checks password to make sure it is valid
// Must match, contain between 8-30 characters, have a number, uppercase, special character, no weird characters
const isValidPassword = (password, verPassword) => {
  if (password !== verPassword) {
	  return 'Password fields must match.';
  } else if (password.length < 8) {
    return 'Password must be at least length 8.';
  } else if (password.length > 30) {
	  return 'Password is too long.';
  } else if (password.search(/\d/) === -1) {
    return 'Password must contain a number';
  } else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) !== -1) {
	  return 'Password contains invalid character';
  } else if (!/[A-Z]/.test(password)) {
	  return 'Password must contain a capital letter';
  }
  return 'success';
};

// Generates hash using bCrypt, storing password safely
var createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
