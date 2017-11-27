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
				 res.send('false');
				 return false;
     }
    	// already exists
     if (user) {
         console.log('User already exists with username: ' + req.body.username);
				 res.send('false');
				 return false;
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
				 res.send('false');
				 return false;
			 }
			 console.log('registeredd', usr);
			 res.send(true);
			 return true;
		 });
 });
 });
		 return router;
};

    // Generates hash using bCrypt, storing password safely
	    var createHash = (password) => {
	        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	    };
