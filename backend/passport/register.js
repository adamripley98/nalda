var LocalStrategy   = require('passport-local');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = (passport) => {
	 passport.use('register', new LocalStrategy({
     passReqToCallback: true // allows us to pass back the entire request to the callback
 },
        (req, username, password, done) => {
            const findOrCreateUser = () => {
                // find a user in Mongo with provided username
                User.findOne({'username': username}, function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error in Register: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        console.log('are these usernames the same', req.param('username'), username);
                        newUser.password = createHash(password);
                        newUser.username = req.param('username');

                        // save the user
                        newUser.save((er) => {
                            if (er) {
                                console.log('Error in Saving user: ' + er);
                                throw er;
                            }
                            console.log('User Registration successful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt, storing password safely
    var createHash = (password) => {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};
