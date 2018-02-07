/**
 * Helper methods to send emails to users
 */

// Import models
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

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
    // Create message
    // TODO get rid of hardcoded host name
    const msg = {
      to: user.username,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Welcome to Nalda, ' + displayName + '! Verify your account.',
      text: 'Hi ' + displayName + ',\n Welcome to Nalda! Please verify your account at the following link:\n\n' +
      'http://' + 'localhost:3000' + '/verify/' + token + '\n\n'
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
