// File to handle password verification via email

// Import frameworks
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Import Models
const User = require('../models/user');

// Import helper methods
const {UserCheck} = require('../helperMethods/authChecking');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Route to send a user a reset password email
 */
module.exports = () => {
  router.get('/verify', (req, res) => {
    // Verify a user is logged in
    UserCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const userId = req.session.passport.user;
        // Find user in Mongo
        User.findById(userId, (err, user) => {
          if (err) {
            res.send({
              success: false,
              error: err.message,
            });
          } else {
            // Email addresses them by first name
            const displayName = user.name.split(' ').length > 1 ? user.name.split(' ')[0] : user.name;
            // Create message
            // TODO create verification link
            const msg = {
              to: user.username,
              from: process.env.SENDGRID_EMAIL,
              subject: 'Verify your account, ' + displayName,
              text: 'Hi ' + displayName + ',\n Please verify your account at the following link.'
            };

            // Send message
            sgMail.send(msg, (errEmail) => {
              if (errEmail) {
                res.send({
                  success: false,
                  error: errEmail,
                });
              } else {
                // Send back user
                res.send({
                  success: true,
                  error: '',
                });
              }
            });
          }
        });
      }
    });
  });
  return router;
};
