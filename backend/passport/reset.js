// Import frameworks
const express = require('express');
const router = express.Router();

// Import Models
const User = require('../models/user');

/**
 * Reset a user's password
 */
 // TODO security
module.exports = () => {
  router.get('/reset/:token', (req, res) => {
    res.send({
      success: false,
      error: 'Not implemented',
    });
  });

  return router;
};
