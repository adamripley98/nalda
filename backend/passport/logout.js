const express = require('express');
const router = express.Router();

/**
 * Backend file for logging users out
 */
module.exports = (passport) => {
  router.post('/logout', (req, res) => {
    // Passport specific logout
    req.logout();

    // Destroying session
    req.session.destroy((err) => {
      if (err) {
        console.log('error logging out', err);
        res.send({
          success: false,
          error: err,
        });
      }

      // If the logout was successful
      res.send({
        success: true,
        error: '',
      });
    });
  });

  // Return the router
  return router;
};
