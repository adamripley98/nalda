const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const routes = require('./backend/routes')(passport);
const LocalStrategy = require('passport-local');
const User = require('./backend/models/user');
const auth = require('./backend/passport/login');

// connecting to mongo
const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

app.use(express.static(path.join(__dirname, 'public')));

// passport configuration work, makes sessions persistant
const expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
// var initPassport = require('./backend/passport/init');
// initPassport(passport);
passport.serializeUser((user, done) => {
    console.log('serializing user: ', user);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        console.log('deserializing user:', user);
        done(err, user);
    });
});

// passport strategy
passport.use('local', new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
    User.findOne({ username: username }, function(err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
        if (err) {
            console.error('Error fetching user in LocalStrategy', err);
            return done(err);
        }
        // if no user present, auth failed
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        // if passwords do not match, auth failed
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        // auth has has succeeded
        return done(null, user);
    });
}
));


app.get('*', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

// app.use('/', auth(passport));
app.use('/', routes);


app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
