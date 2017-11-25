const express = require('express');
const router = express.Router();
const login = require('./passport/login.js');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


const isAuthenticated = (req, res, next) => {
  	if (req.isAuthenticated()) {
      return next();
  }
	   // if the user is not authenticated then redirect to the login page
	  res.redirect('/login');
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


    // (req, res) => {
    //   console.log('goes into login');
    //   // res.render('Home.js');
    //   login(passport);
    // }
  	/* Handle Login POST */
  	router.post('/login', () => login(passport));
      // res.send("yesssss");
    console.log('posted to login');
      // passport.use('login', new LocalStrategy(
      //   (username, password, done) => {
      //       console.log('progresssss');
      //       User.findOne({ username: username }, (err, user) => {
      //           if (err) {
      //               console.log('there was an err finding user', err);
      //               return done(err);
      //           }
      //           if (!user) {
      //               return done(null, false, { message: 'Incorrect username.' });
      //           }
      //           if (!user.validPassword(password)) {
      //               return done(null, false, { message: 'Incorrect password.' });
      //           }
      //           return done(null, user);
      //       });
      //   }
      // ));


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
