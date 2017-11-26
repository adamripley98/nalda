var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

module.exports = (passport) => {
		 // TODO: need to show alert in appropriate way if error or if user exists already
		 router.post('/register', (req, res) => {
			 User.findOne({ 'username': req.body.username }, (err, user) => {
     if (err) {
         console.log('Error in SignUp: ' + err);
				 return;
     }
    	// already exists
     if (user) {
         console.log('User already exists with username: ' + req.body.username);
				 return;
     }
		 // if no error and user doesn't already exist, create
		 const newUser = new User({
			 username: req.body.username,
			 password: req.body.password,
		 });
		 console.log(newUser);
		 newUser.save((er, usr) => {
			 if (er) {
				 console.log('error registering a user', er);
				 return;
			 }
			 console.log('registeredd', usr);
		 });
 });
 });
		 return router;
};

    // Generates hash using bCrypt, storing password safely
	    var createHash = (password) => {
	        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	    };
