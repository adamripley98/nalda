// Import frameworks
const express = require('express');
const router = express.Router();

// Import Models
const User = require('../models/user');

/**
 * Reset a user's password
 */
 // TODO security
 // TODO call from componentDidMount of ResetPassword.js
module.exports = () => {
  router.get('/reset/:token', (req, res) => {
    // Isolate parameters
    const token = req.params.token;
    // Find given user with refresh token in Mongo, makes sure it isn't expired
    User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }}, (err, user) => {
      if (err) {
        res.send({
          success: false,
          error: err.message,
        });
        // Token is not valid
      } else if (!user) {
        res.send({
          success: false,
          error: 'Password reset token is invalid or has expired.'
        });
      } else {
        // No errors
        res.send({
          success: true,
          error: '',
        });
      }
    });
  });

  // Route to handle resetting a password
  // TODO implement with Mongo and Bcrypt
  router.post('/reset/:token', (req, res) => {
    // Isolate variables
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;

    // Error checking
    // TODO make sure new password meets validity conditions
    // TODO cannot be same as old password
    if (!newPassword) {
      res.send({
        success: false,
        error: 'Password cannot be empty.',
      });
    } else if (newPassword !== newPasswordConfirm) {
      res.send({
        success: false,
        error: 'Passwords must match.',
      });
    } else {
      console.log('posted', req.params.token);
      res.send({
        success: false,
        error: 'Not implemented',
      });
    }
  });

  return router;
};
