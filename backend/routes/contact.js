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
    const { email, name, message} = req.body;

    // Error check for empty fields
    let error = '';
    if (!email) {
      error = 'Email field must be populated.';
    } else if (!name) {
      error = 'Name field must be populated.';
    } else if (!message) {
      error = 'Message field must be populated.';
    }

    if (error) {
      res.status(400).send({error});
      return;
    }
    // Isolate the API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Create message
    const msg = {
      to: process.env.SENDGRID_EMAIL,
      from: email,
      subject: 'Hi there!',
      text: message,
    };

    // Send message
    sgMail.send(msg)
    .then(() => {
      res.send({error: ''});
      return;
    })
    .catch(() => {
      res.status(400).send({error: 'Cannot send email'});
      return;
    });
  });

  return router;
};
