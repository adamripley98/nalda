const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const api = require('./backend/routes');

var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');


// connecting to mongo
const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

app.use(express.static(path.join(__dirname, 'public')));

// passport configuration work, makes sessions persistant
const passport = require('passport');
const expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// TODO: implement more robust password valid checker
const isValidPassword = (pswd) => {
    return (pswd.length > 3);
};

// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback: true
},
(req, username, password, done) => {
    // check in mongo if a user with username exists or not
    User.findOne({'username': username },
      (err, user) => {
        // In case of any error, return using the done method
          if (err) {
              return done(err);
          }
        // Username does not exist, log error & redirect back
          if (!user) {
              console.log('User Not Found with username ' + username);
              return done(null, false,
                    req.flash('message', 'User Not found.'));
          }
          // User exists but wrong password, log the error
          if (!isValidPassword(user, password)) {
              console.log('Invalid Password');
              return done(null, false,
                  req.flash('message', 'Invalid Password'));
          }
          // User and password both match, success
          return done(null, user);
      }
      );
}));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.use('/api', api);

app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
