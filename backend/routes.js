const express = require('express');
const router = express.Router();
const login = require('./passport/login.js');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const isAuthenticated = (req, res, next) => {
  	if (req.isAuthenticated()) {
      return next();
  }
	   // if the user is not authenticated then redirect to the login page
	  // res.redirect('/login');
    console.log('NOT LOGGED IN');
    return "NOT AUTHENTICATED";
};

module.exports = (passport) => {
    router.post('/', (req, res) => {
        res.render('home');
        console.log('posted to /');
    });

  	/* GET login page. */
  	router.get('/', (req, res) => {
      // Display the Login page with any flash message, if any
  		res.render('index', { message: req.flash('message') });
  	});

	 /* GET Home Page */
    router.get('/home', isAuthenticated, (req, res) => {
  	   res.render('home', { user: req.user });
    });

  	/* Handle Logout */
  	router.get('/signout', (req, res) => {
  		req.logout();
  		res.redirect('/');
  	});

    return router;
};
