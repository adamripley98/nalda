const express = require('express');
const router = express.Router();

/**
 * Backend file for logging in existing users
 */
module.exports = (passport) => {
  router.post('/login', (req, res, next) => {
    // Passport method for authenticating users using local strategy
    passport.authenticate('local', (passportErr, user) => {
      if (passportErr) {
        // If there was an error in the authentication
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
        // Built in passport login method
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            res.send({
              success: false,
              error: loginErr,
            });
          } else {
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
