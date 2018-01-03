var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

// Backend file for logging users out
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
      // Logout successful
      res.send({
        success: true,
        error: '',
      });
    });
  });

		 return router;
};
