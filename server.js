const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const api = require('./backend/routes')(passport);

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
var initPassport = require('./backend/passport/init');
initPassport(passport);


app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.use('/api', api);

app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
