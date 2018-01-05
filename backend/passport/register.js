const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();

/**
 * Backend file for registering new users
 */
module.exports = (passport) => {
  router.post('/register', (req, res) => {
    // Ensure password meets validity conditions
    if (isValidPassword(req.body.password, req.body.verPassword) !== 'success') {
      res.send({
        success: false,
        error: isValidPassword(req.body.password, req.body.verPassword),
      });
    } else {
      // Will attempt to find user in database
      User.findOne({ 'username': req.body.username }, (err, user) => {
        if (err) {
        	res.send({
        		success: false,
        		error: 'Unknown registration error' + err,
        	});
        }

	    	// Error if the user already exists
        if (user) {
				  res.send({
					  success: false,
				    error: 'User with username' + req.body.username + 'already exists',
				  });
        }

        // If no error and user doesn't already exist, create a user
        // Default sets userType to user, admin can change to admin or curator
        const newUser = new User({
          name: req.body.name,
          username: req.body.username,
          location: req.body.location,
				  password: createHash(req.body.password),
			    userType: 'user'
		    });

				// Saving new user in Mongo
        newUser.save((er, usr) => {
          if (er) {
            res.send({
              success: false,
              error: 'Unknown registration error' + er,
            });
          }

					// Built in passport method for logging in
			    req.login(usr, (e) => {
				    if (e) {
						  res.send({
						    success: false,
					      error: 'Error logging in new user' + e
					    });
				    }

						// Finally, if registration is successful, send back user
				    res.send({
			        success: true,
					    error: '',
				      user: usr,
				    });
		      });
        });
		  });
    }
  });

  return router;
};

/**
 * Checks password to make sure it is valid
 * Must match, contain between 8-30 characters, have a number, uppercase,
 * special character, no weird characters
 */
const isValidPassword = (password, verPassword) => {
  // Error checking
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

  // If there was no error
  return 'success';
};

/**
 * Generates hash using bCrypt, storing password safely
 */
constcreateHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
