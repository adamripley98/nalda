// Import frameworks
const express = require('express');
const router = express.Router();

/**
 * Backend file for logging in with facebook
 */
module.exports = (passport) => {
  router.get('/auth/facebook', passport.authenticate('facebook'));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  return router;
};
