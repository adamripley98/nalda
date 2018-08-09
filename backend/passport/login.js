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
        console.log('pass err');
        res.status(404).send({error: passportErr});
        return;
      }
      // If the user doesn't actually exist
      if (!user) {
        res.status(404).send({error: 'Invalid email or password.'});
        return;
      }
      // Built in passport login method
      req.logIn(user, (loginErr) => {
        // Error logging in
        if (loginErr) {
          console.log('log err');
          res.status(404).send({error: loginErr});
          return;
        }
        // Finally, if there is no error, send back user
        res.send({user});
        return;
      });
    })(req, res, next);
  });

  return router;
};
