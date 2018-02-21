/**
 * Helper methods to send emails to users
 */

// Import models
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

// Import env variables
const HOST_URL = process.env.HOST_URL;

// Helper method to send user a welcome email
const sendWelcomeEmail = (user, cb) => {
  // Generate a random token
  crypto.randomBytes(20, (errCrypto, buf) => {
    if (errCrypto) {
      cb({
        success: false,
        error: 'Error generating a token.',
      });
      return;
    }
    const token = buf.toString('hex');
    // If registration is successful, send an email welcoming to Nalda.
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // Email addresses them by first name
    const displayName = user.name.split(' ').length > 1 ? user.name.split(' ')[0] : user.name;

    // Set up the html
    const html = (
      `<div style=\"background:#efefef;background-color:#efefef;width:100%;padding:0px,16px,32px,16px;\"` +
      `bgcolor:\"#efefef\"><div style=\"background:#ffffff;background-color:#ffffff;width:100%;padding:16px;` +
      `color:#606060;font-family:Verdana, serif;\" bgcolor=\"#ffffff\">Hi ${displayName},<br/><br/>Welcome to Nalda!` +
      ` Please verify your account at the following link:<br/><br/><a href="${HOST_URL}/verify/${token}">${HOST_URL}/verify/${token}</a><br/></div></div>`
    );

    // Create message
    const msg = {
      to: user.username,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Welcome to Nalda, ' + displayName + '! Verify your account.',
      text: 'Hi ' + displayName + ',\n Welcome to Nalda! Please verify your account at the following link:\n\n' +
      HOST_URL + '/verify/' + token + '\n\n',
      html: html,
    };

    // Send message
    sgMail.send(msg, (errEmail) => {
      if (errEmail) {
        cb({
          success: false,
          error: errEmail,
        });
        return;
      }
      cb({
        success: true,
        error: '',
        token,
      });
      return;
    });
  });
};

module.exports = {
  sendWelcomeEmail,
};
