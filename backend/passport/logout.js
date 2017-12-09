var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

module.exports = (passport) => {
  router.post('/logout', (req, res) => {
    console.log('session before', req.session);
    req.logout();
    console.log('session after', req.session);
    // TODO: Need to understand if I need to destroy session totally or just destroy passport portion
    // req.session.destroy((err) => {
    //   if (err) {
    //     console.log('error logging out', err);
    //   }
    //   res.send(true);
    // });
    res.send(true);
    return true;
  });

		 return router;
};