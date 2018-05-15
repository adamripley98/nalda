/**
 * Handles all backend routes for contacting though sendgrid
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Export the following methods for routing
module.exports = () => {
  // Route to send an email to Nalda team
  router.post('/', (req, res) => {
    // Isolate variables from the request
    const {
      email,
      name,
      message,
    } = req.body;

    // Error check for empty fields
    if (!email) {
      res.send({
        success: false,
        error: 'Email field must be populated.',
      });
    } else if (!name) {
      res.send({
        success: false,
        error: 'Name field must be populated.',
      });
    } else if (!message) {
      res.send({
        success: false,
        error: 'Message field must be populated.',
      });
    } else {
      // Isolate the API key
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Create message
      const msg = {
        to: process.env.SENDGRID_EMAIL,
        from: req.body.email,
        subject: 'Hi there!',
        text: req.body.message,
      };

      // Send message
      sgMail.send(msg, (err) => {
        if (err) {
          res.send({
            success: false,
            error: 'Error sending message.',
          });
        } else {
          res.send({
            success: true,
            error: '',
          });
        }
      });
    }
  });
  return router;
};
