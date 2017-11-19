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
        res.render('home');
        console.log('posted to /');
    });

  	/* GET login page. */
  	router.get('/', (req, res) => {
      // Display the Login page with any flash message, if any
  		res.render('index', { message: req.flash('message') });
  	});


    // passport.authenticate('login', {
    //   successRedirect: '/home',
    //   failureRedirect: '/',
    //   failureFlash: true,
    // })

  	/* Handle Login POST */
  	router.post('/login', (req, res) => {
      console.log('goes into login');
      res.render('Home.js');
    });

    router.get('/login', (req, res) => {
        console.log('does it go here');
        res.render('login', {message: req.flash('message')});
    });

  	/* GET Registration Page */
  	router.get('/register', (req, res) => {
      console.log('does it even enter REGISTER???');
  		res.render('register', {message: req.flash('message')});
  	});

  	/* Handle Registration POST */
  	router.post('/register', passport.authenticate('register', {
  		successRedirect: '/home',
  		failureRedirect: '/register',
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
