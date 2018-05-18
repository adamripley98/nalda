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

// Import Models
const User = require('./backend/models/user');

// Import helper methods
const {sendWelcomeEmail} = require('./backend/helperMethods/sendEmail');

// Import auth routes
const login = require('./backend/passport/login');
const register = require('./backend/passport/register');
const logout = require('./backend/passport/logout');
const changePassword = require('./backend/passport/changePassword');
const facebook = require('./backend/passport/facebook');
const google = require('./backend/passport/google');
const forgot = require('./backend/passport/forgot');
const reset = require('./backend/passport/reset');
const verify = require('./backend/passport/verify');

// Import other routes
const articles = require('./backend/routes/articles')();
const listings = require('./backend/routes/listings')();
const videos = require('./backend/routes/videos')();
const users = require('./backend/routes/users')();
const admin = require('./backend/routes/admin')();
const contact = require('./backend/routes/contact')();
const reviews = require('./backend/routes/reviews')();
const home = require('./backend/routes/home')();

// Pull all env variables are present
const {
  MONGODB_URI,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_APP_CALLBACK,
  GOOGLE_APP_ID,
  GOOGLE_APP_SECRET,
  GOOGLE_APP_CALLBACK,
  SENDGRID_API_KEY,
  SENDGRID_EMAIL,
  AWS_BUCKET_NAME,
  AWS_USER_KEY,
  AWS_USER_SECRET,
  HOST_URL,
} = process.env;

// Ensure that each variable is present
let envError = "";
if (!MONGODB_URI) envError = "MONGODB_URI";
else if (!FACEBOOK_APP_ID) envError = "FACEBOOK_APP_ID";
else if (!FACEBOOK_APP_SECRET) envError = "FACEBOOK_APP_SECRET";
else if (!GOOGLE_APP_ID) envError = "GOOGLE_APP_ID";
else if (!GOOGLE_APP_SECRET) envError = "GOOGLE_APP_SECRET";
else if (!GOOGLE_APP_CALLBACK) envError = "GOOGLE_APP_CALLBACK";
else if (!SENDGRID_API_KEY) envError = "SENDGRID_API_KEY";
else if (!SENDGRID_EMAIL) envError = "SENDGRID_EMAIL";
else if (!AWS_BUCKET_NAME) envError = "AWS_BUCKET_NAME";
else if (!AWS_USER_KEY) envError = "AWS_USER_KEY";
else if (!AWS_USER_SECRET) envError = "AWS_USER_SECRET";
else if (!HOST_URL) envError = "HOST_URL";
if (envError) {
  console.error(`ERROR: ${envError} environment variable not found`);
  process.exit(1);
}

// Connecting to mongo
const options = {
  useMongoClient: true,
  // sets how many times to try reconnecting
  reconnectTries: Number.MAX_VALUE,
  // sets the delay between every retry (milliseconds)
  reconnectInterval: 1000,
};
mongoose.connect(MONGODB_URI, options);

// Middleware
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Passport configuration work, makes sessions persistant
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
app.use(
  expressSession({
    secret: 'mySecretKey',
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true,
  })
);

// Favicon config
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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
      User.findOne({username: profile._json.email}, (err, user) => {
        if (err) {
          cb(err, null);
          // If no user, create him in Mongo
        } else if (!user) {
          // Create a new user
          // TODO location
          const newUser = new User({
            name: profile.displayName,
            username: profile._json.email,
            userType: 'user',
            facebookId: profile.id,
            profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
          });
          // Send new user a welcome email
          sendWelcomeEmail(newUser, (resp) => {
            if (!resp.success) {
              cb(resp.error, null);
            }
            // Update new user
            newUser.accountVerified = false;
            newUser.verificationToken = resp.token;
            // Save new user in mongo
            newUser.save((errSave) => {
              if (errSave) {
                cb(errSave, null);
              } else {
                // If successful return profile
                cb(null, newUser);
              }
            });
          });
        } else {
          // Add facebook id to profile
          user.facebookId = profile.id;
          // Save changes
          user.save((errSave) => {
            if (errSave) {
              cb(errSave, null);
            } else {
              // User already exists
              cb(null, user);
            }
          });
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
    User.findOne({username: profile.emails[0].value}, (err, user) => {
      if (err) {
        cb(err, null);
        // If no user, create him in Mongo
      } else if (!user) {
        // Create a new user
        // TODO location
        const newUser = new User({
          name: profile.displayName,
          username: profile.emails[0].value,
          userType: 'user',
          googleId: profile.id,
          profilePicture: profile.photos[0].value,
        });

        // Send new user a welcome email
        sendWelcomeEmail(newUser, (resp) => {
          if (!resp.success) {
            cb(resp.error, null);
          } else {
            // Update new user
            newUser.accountVerified = false;
            newUser.verificationToken = resp.token;

            // Save new user in mongo
            newUser.save((errSave) => {
              if (errSave) {
                cb(errSave, null);
              } else {
                // If successful return profile
                cb(null, newUser);
              }
            });
          }
        });
      } else {
        // Update existing user
        user.googleId = profile.id;
        // Save changes in Mongo
        user.save((errSave) => {
          if (errSave) {
            cb(errSave, null);
          } else {
            // User already exists
            cb(null, user);
          }
        });
      }
    });
  });
}));

// Method to check encrypted password
const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

// Routing backend middleware for auth routes
app.use('/api/', login(passport));
app.use('/api/', register(passport));
app.use('/api/', logout(passport));
app.use('/api/', changePassword(passport));
app.use('/api/', facebook(passport));
app.use('/api/', google(passport));
app.use('/api/', forgot(passport));
app.use('/api/', reset(passport));
app.use('/api/', verify(passport));

// Routing backend middleware for other routes
app.use('/api/', routes);
app.use('/api/articles/', articles);
app.use('/api/listings/', listings);
app.use('/api/videos/', videos);
app.use('/api/users/', users);
app.use('/api/', admin);
app.use('/api/contact/', contact);
app.use('/api/reviews/', reviews);
app.use('/api/home/', home);

app.get('*', (request, response) => {
  response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.listen(PORT, error => {
  error
  ? console.error(error)
  : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
