/**
 * Handles SSL work
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
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
    res.send('sQqntnAKnzqPmtp6DSZzYgrGbSKs_t1ZdF5sJYOhSu4.2p3-v58-YTA3HJDTRTpUfSDYFD0zik-T5uJnVGsz-lE');
  });

  // Return the router for use throughout the application
  return router;
};
