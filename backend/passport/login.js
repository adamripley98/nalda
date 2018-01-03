const express = require('express');
var router = express.Router();

// Backend file for logging in existing users
module.exports = (passport) => {
  router.post('/login', (req, res, next) => {
    // Passport method for authenticating users using local strategy
    passport.authenticate('local', (err, user) => {
      // Sending back error
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // If the user doesn't actually exist
      } else if (!user) {
        res.send({
          success: false,
          error: 'Invalid email or password.'
        });
      }
      // Built in passport login method
      req.logIn(user, (errr) => {
        if (errr) {
          res.send({
            success: false,
            error: errr,
          });
        }
        // Finally, if there is no error, send back user
        res.send({
          success: true,
          error: false,
          user,
        });
      });
    })(req, res, next);
  });

  return router;
};
