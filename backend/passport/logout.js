const express = require('express');
const router = express.Router();

/**
 * Backend file for logging users out
 */
module.exports = () => {
  router.post('/logout', (req, res) => {
    // Passport specific logout
    req.logout();

    // Destroying session
    req.session.destroy((err) => {
      // Error logging out
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If the logout was successful
        res.send({
          success: true,
          error: '',
        });
      }
    });
  });

  // Return the router
  return router;
};
