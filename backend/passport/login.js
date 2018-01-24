// Import frameworks
const express = require('express');
const router = express.Router();

/**
 * Backend file for logging in existing users
 */
module.exports = (passport) => {
  router.post('/login', (req, res, next) => {
    // Passport method for authenticating users using local strategy
    passport.authenticate('local', (passportErr, user) => {
      // If there was an error in the authentication
      if (passportErr) {
        res.send({
          success: false,
          error: passportErr,
        });
      } else if (!user) {
        // If the user doesn't actually exist
        res.send({
          success: false,
          error: 'Invalid email or password.'
        });
      } else {
        console.log('req ses before local', req.session);
        // Built in passport login method
        req.logIn(user, (loginErr) => {
          // Error logging in
          if (loginErr) {
            res.send({
              success: false,
              error: loginErr,
            });
          } else {
            console.log('req ses after', req.session);
            // Finally, if there is no error, send back user
            res.send({
              success: true,
              error: false,
              user,
            });
          }
        });
      }
    })(req, res, next);
  });

  return router;
};
