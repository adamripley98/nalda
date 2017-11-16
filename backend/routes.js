const express = require('express');
const router = express.Router();

const isAuthenticated = (req, res, next) => {
  	if (req.isAuthenticated()) {
      return next();
  }
	   // if the user is not authenticated then redirect him to the login page
	  res.redirect('/');
    return "NOT AUTHENTICATED";
};

module.exports = (passport) => {
    router.post('/', (req, res) => {
        console.log('posted to /');
    });
  	/* GET login page. */
  	router.get('/', (req, res) => {
      // Display the Login page with any flash message, if any
  		res.render('index', { message: req.flash('message') });
  	});

  	/* Handle Login POST */
  	router.post('/login', passport.authenticate('login', {
  		successRedirect: '/home',
  		failureRedirect: '/',
  		failureFlash: true,
  	}));

  	/* GET Registration Page */
  	router.get('/signup', (req, res) => {
  		res.render('register', {message: req.flash('message')});
  	});

  	/* Handle Registration POST */
  	router.post('/signup', passport.authenticate('signup', {
  		successRedirect: '/home',
  		failureRedirect: '/signup',
  		failureFlash: true,
  	}));

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
