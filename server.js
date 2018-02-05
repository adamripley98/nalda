// Import frameworks
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const routes = require('./backend/routes')(passport);
const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Import environmental variables
const PORT = process.env.PORT || 3000;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_APP_CALLBACK = process.env.FACEBOOK_APP_CALLBACK;
const GOOGLE_APP_ID = process.env.GOOGLE_APP_ID;
const GOOGLE_APP_SECRET = process.env.GOOGLE_APP_SECRET;
const GOOGLE_APP_CALLBACK = process.env.GOOGLE_APP_CALLBACK;

// Import Models
const User = require('./backend/models/user');

// Import auth routes
const login = require('./backend/passport/login');
const register = require('./backend/passport/register');
const logout = require('./backend/passport/logout');
const changePassword = require('./backend/passport/changePassword');
const facebook = require('./backend/passport/facebook');
const google = require('./backend/passport/google');
const forgot = require('./backend/passport/forgot');
const reset = require('./backend/passport/reset');

// Import other routes
const articles = require('./backend/routes/articles')();
const listings = require('./backend/routes/listings')();
const videos = require('./backend/routes/videos')();
const users = require('./backend/routes/users')();
const admin = require('./backend/routes/admin')();
const contact = require('./backend/routes/contact')();
const reviews = require('./backend/routes/reviews')();

// Connecting to mongo
const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Passport configuration work, makes sessions persistant
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
app.use(expressSession({
  secret: 'mySecretKey',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
})
);
// app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
const flash = require('connect-flash');
app.use(flash());

// Initialize Passport
const initPassport = require('./backend/passport/init');
initPassport(passport);

// Passport strategy
passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, done) => {
  // Find the user with the given username
  User.findOne({ username: username }, (err, user) =>{
    // If there's an error, finish trying to authenticate (auth failed)
    if (err) {
      return done(err);
    }

    // If no user is present, authentication failed
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    // If passwords do not match, auth failed
    if (!isValidPassword(user, password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    // Authentication is successful
    return done(null, user);
  });
}
));

// Facebook strategy
passport.use(
  new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_APP_CALLBACK,
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name']
    // profileFields: ['id', 'name', 'username', 'displayName', 'photos', 'email'],
  },
  (accessToken, refreshToken, profile, cb) => {
    // If profile is found, search mongo for him
    process.nextTick(() => {
      User.find({facebookId: profile.id}, (err, user) => {
        if (err) {
          return cb(err, null);
          // If no user, create him in Mongo
        } else if (!user.length) {
          // Create a new user
          // TODO location
          const newUser = new User({
            name: profile.displayName,
            username: profile._json.email,
            userType: 'user',
            facebookId: profile.id,
            profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
          });
          // Save new user in mongo
          newUser.save((errSave) => {
            if (errSave) {
              return cb(errSave, null);
            }
            // If successful return profile
            return cb(null, newUser);
          });
        } else {
          // User already exists
          return cb(null, user);
        }
      });
    });
  }
));

// Google OAuth Strategy setup
passport.use(new GoogleStrategy({
  clientID: GOOGLE_APP_ID,
  clientSecret: GOOGLE_APP_SECRET,
  callbackURL: GOOGLE_APP_CALLBACK,
}, (accessToken, refreshToken, profile, cb) => {
  process.nextTick(() => {
    User.find({googleId: profile.id}, (err, user) => {
      if (err) {
        return cb(err, null);
        // If no user, create him in Mongo
      } else if (!user.length) {
        // Create a new user
        // TODO location
        const newUser = new User({
          name: profile.displayName,
          username: profile.emails[0].value,
          userType: 'user',
          googleId: profile.id,
          profilePicture: profile.photos[0].value,
        });
        // Save new user in mongo
        newUser.save((errSave) => {
          if (errSave) {
            return cb(errSave, null);
          }
          // If successful return profile
          return cb(null, newUser);
        });
      } else {
        // User already exists
        return cb(null, user);
      }
    });
  });
}));

// Method to check encrypted password
const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

// Routing backend middleware
app.use('/api/', login(passport));
app.use('/api/', register(passport));
app.use('/api/', logout(passport));
app.use('/api/', changePassword(passport));
app.use('/api/', facebook(passport));
app.use('/api/', google(passport));
app.use('/api/', forgot(passport));
app.use('/api/', reset(passport));
app.use('/api/', routes);
app.use('/api/articles/', articles);
app.use('/api/listings/', listings);
app.use('/api/videos/', videos);
app.use('/api/users/', users);
app.use('/api/', admin);
app.use('/api/contact/', contact);
app.use('/api/reviews/', reviews);

app.get('*', (request, response) => {
  response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.listen(PORT, error => {
  error
  ? console.error(error)
  : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
