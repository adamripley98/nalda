// Import frameworks
const bCrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();

// Import model
const User = require('../models/user');
// TODO Security
/**
 * Update a user's password
 * @param String oldPassword
 * @param String newPassword
 * @param String newPasswordConfirm
 * @param String userId
 */
module.exports = () => {
  router.post('/users/password', (req, res) => {
    // Isolate variables from the request
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;

    // Error checking
    if (!oldPassword) {
      res.send({
        success: false,
        error: "Old password must be populated.",
      });
    } else if (!newPassword) {
      res.send({
        success: false,
        error: "New password must be populated.",
      });
    } else if (!newPasswordConfirm) {
      res.send({
        success: false,
        error: "New password confirmation must be populated.",
      });
    } else if (oldPassword === newPassword) {
      res.send({
        success: false,
        error: "New password must be unique from old password.",
      });
    } else if (newPassword !== newPasswordConfirm) {
      res.send({
        success: false,
        error: "New password and confirmation password must match.",
      });
    } else {
      // Now check if new password meets validity conditions
      if (invalidPassword(newPassword)) {
        res.send({
          success: false,
          error: invalidPassword(newPassword),
        });
      } else {
        // If valid password, find user in database
        User.findById(req.body.userId, (err, user) => {
          // Error finding user
          if (err) {
            res.send({
              success: false,
              error: err,
            });
          // Make sure old password matches
          } else if (!isCorrect(user, oldPassword)) {
            res.send({
              success: false,
              error: 'Old password did not match.',
            });
          } else {
            // Update password
            user.password = createHash(newPassword);
            user.save((errUser) => {
              // Error saving changes
              if (errUser) {
                res.send({
                  succcess: false,
                  error: errUser,
                });
              } else {
                // Successful password change
                res.send({
                  success: true,
                  error: '',
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
 * Must contain between 8-30 characters, have a number, uppercase,
 * special character, no weird characters
 */
const invalidPassword = (password) => {
  // Error checking
  if (password.length < 8) {
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

// Method to check encrypted password
const isCorrect = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};
