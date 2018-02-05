// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');
const crypto = require('crypto');

// Import Models
const User = require('../models/user');

/**
 * Route to send a user a reset password email
 */
 // TODO security
module.exports = () => {
  router.post('/forgot', (req, res) => {
    // Ensure user has entered an email
    if (!req.body.username) {
      res.send({
        success: false,
        error: 'Please enter your email.',
      });
    } else {
      async.waterfall([
        (done) => {
          // First generate a random token for reset link
          crypto.randomBytes(20, (err, buf) => {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        (token, done) => {
          // Then find user in Mongo
          User.findOne({ username: req.body.username }, (err, user) => {
            if (!user) {
              res.send({
                success: false,
                error: 'No account with that email address exists.',
              });
            } else {
              // Add password refresh data to user
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
              // Save changes in mongo
              user.save((errSave) => {
                done(errSave, token, user);
              });
            }
          });
        },
        (token, user, done) => {
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);

          // Create message
          const msg = {
            to: user.username,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Nalda Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };

          // Send message
          sgMail.send(msg, (err) => {
            if (err) {
              res.send({
                success: false,
                error: err,
              });
              done();
            } else {
              res.send({
                success: true,
                error: '',
              });
              done();
            }
          });
        }
        // Error catching
      ], (err) => {
        if (err) {
          res.send({
            success: false,
            error: err,
          });
        }
      });
    }
  });

  return router;
};
