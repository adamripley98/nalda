// Import frameworks
const bCrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();

// Import models
const User = require('../models/user');

// Import helper methods
const {sendWelcomeEmail} = require('../helperMethods/sendEmail');

/**
 * Backend file for registering new users
 */
module.exports = () => {
  router.post('/register', (req, res) => {
    // Error checking
    if (!req.body.name) {
      res.send({
        success: false,
        error: 'Name field must be populated.',
      });
    } else if (!req.body.username) {
      res.send({
        success: false,
        error: 'Email field must be populated.',
      });
    } else if (!req.body.name.indexOf(" ")) {
      res.send({
        success: false,
        error: 'Enter full name.',
      });
    } else if (Object.keys(req.body.location).length === 0) {
      res.send({
        success: false,
        error: 'Location field must be populated.',
      });
    } else {
      // Ensure password meets validity conditions
      if (invalidPassword(req.body.password, req.body.verPassword)) {
        res.send({
          success: false,
          error: invalidPassword(req.body.password, req.body.verPassword),
        });
      } else {
        // Will attempt to find user in database
        User.findOne({ 'username': req.body.username }, (err, user) => {
          if (err) {
          	res.send({
          		success: false,
          		error: 'Unknown registration error: ' + err,
          	});
          } else
  	    	// Error if the user already exists
          if (user) {
  				  res.send({
  					  success: false,
  				    error: 'User with username ' + req.body.username + ' already exists',
  				  });
          } else {
            const newUser = new User({
              name: req.body.name,
              username: req.body.username,
              location: req.body.location,
              password: createHash(req.body.password),
              userType: 'user',
              profilePicture: 'https://s3.amazonaws.com/nalda/default-profile-picture.png',
            });

            sendWelcomeEmail(newUser, (resp) => {
              if (!resp.success) {
                res.send({
                  success: false,
                  error: resp.error,
                });
              } else {
                // Update user
                newUser.accountVerified = false;
                newUser.verificationToken = resp.token;
                // Saving new user in Mongo
                newUser.save((errUser, usr) => {
                  if (errUser) {
                    res.send({
                      success: false,
                      error: 'Unknown registration error: ' + errUser,
                    });
                  } else {
                    // Built in passport method for logging in
                    req.login(usr, (errLogin) => {
                      if (errLogin) {
                        res.send({
                          success: false,
                          error: 'Error logging in new user: ' + errLogin,
                        });
                      } else {
                        // Send back user
                        res.send({
                          success: true,
                          error: '',
                          user: usr,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
  		  });
      }
    }
  });

  return router;
};

/**
 * Checks password to make sure it is valid
 * Must match, contain between 8-30 characters, have a number, uppercase,
 * special character, no weird characters
 */
const invalidPassword = (password, verPassword) => {
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
  return false;
};

/**
 * Generates hash using bCrypt, storing password safely
 */
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
