/**
 * Handles all backend routes for searching, loading home data, and syncing state
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const Article = require('./models/article');
const Listing = require('./models/listing');
const Video = require('./models/video');
const User = require('./models/user');

// Import helper methods
const {UserCheck} = require('./helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Route to signify that the API is working
   */
  router.get('/', (req, res) => {
    res.send({
      success: true,
      data: "API is up and running.",
    });
  });

  /**
   * Route to make sure that backend and frontend states are synced.
   */
  router.get('/sync', (req, res) => {
    // If passport state is not present, user is not logged in on the backend
    if (!req.session.passport) {
      // States are NOT synced, user is not logged in through express!
      res.send({
        success: false,
        data: 'States are not synced!'
      });
    } else {
      // User is logged in on backend, check if it is through facebook
      const userId = req.session.passport.user;
      User.findById(userId, (err, user) => {
        if (err) {
          res.send({
            success: false,
            error: err.message,
          });
        } else if (!user) {
          res.send({
            success: false,
            error: 'User not found.',
          });
        } else {
          // If user uses facebook or google login
          if (user.facebookId || user.googleId) {
            const userToLogIn = {
              name: user.name,
              profilePicture: user.profilePicture,
              userType: user.userType,
              userId: user._id,
              location: user.location.name,
            };
            res.send({
              success: true,
              error: '',
              oAuthLogin: true,
              user: userToLogIn,
            });
          } else {
            // User is logged in with email/password, don't need to do anything
            res.send({
              success: true,
              error: '',
              oAuthLogin: false,
            });
          }
        }
      });
    }
  });

  /**
   * Pull listings, videos, articles, and curators from the database based off what is searched for
   * @param search (what term user searched for)
   */
  router.post('/search', (req, res) => {
    // First search through articles
    Article.find({"$text": { $search: req.body.search }}, (errArticle, articles) => {
      // Error finding articles
      if (errArticle) {
        res.send({
          success: false,
          error: errArticle.message
        });
      } else {
        // Now search through listings
        // TODO: Don't allow search through reviewers
        Listing.find({"$text": { $search: req.body.search }}, (errListing, listings) => {
          // Error finding listings
          if (errListing) {
            res.send({
              success: false,
              error: errListing.message,
            });
          } else {
            // Now search through videos
            Video.find({"$text": { $search: req.body.search }}, (errVideo, videos) => {
              // Error finding videos
              if (errVideo) {
                res.send({
                  success: false,
                  error: errVideo.message,
                });
              } else {
                // Now search through users
                User.find({"$text": { $search: req.body.search }}, (errUser, users) => {
                  // Error finding users
                  if (errUser) {
                    res.send({
                      success: false,
                      error: errUser.message,
                    });
                  } else {
                    // Make sure that users are curators or admins, do not want to be able to search for regular users
                    const curators = [];
                    // Check each user to make sure they are admin or curator before returning
                    users.forEach((user) => {
                      if (user.userType !== 'user') {
                        curators.push(user);
                      }
                    });
                    // Do not return private information about curators (password, username, etc)
                    curators.forEach((curator) => {
                      curator.password = '';
                      curator.userType = '';
                      curator.username = '';
                    });
                    // If there were no errors, send back all data
                    res.send({
                      success: true,
                      error: '',
                      data: {
                        articles,
                        listings,
                        videos,
                        curators,
                      },
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  /**
   * Route to receive user's information from Mongo
   * @param userID
   */
  router.get('/account', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      // Check to make sure user is accessing their own data
      // TODO Will need to change once we don't pass userId from frontend
      } else if (req.session.passport.user !== req.query.userId) {
        res.send({
          success: false,
          error: 'You may only access your own information.'
        });
      } else {
          // Find user in Mongo
        User.findById(req.session.passport.user, (err, user) => {
          if (err) {
          // If there was an error with the request
            res.send({
              success: false,
              error: err.message,
            });
            // If no user exists
          } else if (!user) {
            res.send({
              success: false,
              error: 'Can not find user',
            });
          } else {
            // If everything went as planned, send back user
            // Remove private user info first
            user.password = '';
            res.send({
              success: true,
              data: user,
            });
          }
        });
      }
    });
  });


  // Return the router for use throughout the application
  return router;
};
