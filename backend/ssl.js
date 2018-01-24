/**
 * Handles all backend routes
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 * TODO file should be split up into many smaller files
 *      for example, all routes prefixed with "/articles" can be in their own
 *      router imported here.
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Export the following methods for routing
module.exports = () => {
  /**
   * Route to signify that the SSL certificate is working
   */
  router.get('/:content', (req, res) => {
    console.log("IN IT");
    res.send('QWxcfNd-M_z-bcNx20QQykD4wNI6Z4RL5t-zjzfVJL4.2p3-v58-YTA3HJDTRTpUfSDYFD0zik-T5uJnVGsz-lE');
  });

  // Return the router for use throughout the application
  return router;
};
