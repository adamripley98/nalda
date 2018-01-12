const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();

/**
 * Backend file for registering new users
 */
module.exports = () => {
  router.post('/register', (req, res) => {
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
          // If no error and user doesn't already exist, create a user
          // Default sets userType to user, admin can change to admin or curator
          const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            location: req.body.location,
            password: createHash(req.body.password),
            userType: 'user',
            profilePicture: 'http://www.racialjusticenetwork.co.uk/wp-content/uploads/2016/12/default-profile-picture.png',
          });

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
                  // Finally, if registration is successful, send back user
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
