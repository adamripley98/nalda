// Import frameworks
const express = require('express');
const router = express.Router();

/**
 * Backend file for logging in with facebook
 */
module.exports = (passport) => {
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

  router.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', {scope: ['email']}, (errPassport, user) => {
      if (errPassport) {
        // TODO redirect to error
        res.send({
          success: false,
          error: errPassport,
        });
      } else {
        req.logIn(user, (loginErr) => {
          // Error logging in
          if (loginErr) {
            // TODO Handle better, redirect somewhere
            res.send({
              success: false,
              error: loginErr,
            });
          } else {
            // Finally, if there is no error, send back user
            res.redirect('/');
          }
        });
      }
    })(req, res, next);
  });

  return router;
};
