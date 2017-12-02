var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const express = require('express');
var router = express.Router();

module.exports = (passport) => {
		 router.post('/logout', (req, res) => {
   console.log('tf is req', req, 'wb data', req.data, 'wb body', req.body);
		 req.logout();
 });
		 return router;
};

    // Generates hash using bCrypt, storing password safely
	    var createHash = (password) => {
	        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	    };
