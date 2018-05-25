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
            error: 'State sync error.',
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

  function makeSuffixes(values) {
    var results = [];
    values.sort().reverse().forEach(function(val) {
      let tmp, hasSuffix;
      for (var i = 0; i < val.length - 2; i++) {
        tmp = val.substr(i).toUpperCase();
        hasSuffix = false;
        for (var j = 0; j < results.length; j++) {
          if (results[j].indexOf(tmp) === 0) {
            hasSuffix = true;
            break;
          }
        }
        if (!hasSuffix) results.push(tmp);
      }
    });
    console.log('suffs', results);
    return results;
  }
  /**
   * Pull listings, videos, articles, and curators from the database based off what is searched for
   * @param search (what term user searched for)
   */
  router.post('/search', (req, res) => {
    // Search through relevant data in Mongo
    Article.find({$or: [{"title": new RegExp(req.body.search, "i")}, {"subtitle": new RegExp(req.body.search, "i")}]}, (errArticle, articles) => {
      Listing.find({$or: [{"title": new RegExp(req.body.search, "i")}, {"description": new RegExp(req.body.search, "i")}, {"naldaFavorite": new RegExp(req.body.search, "i")}]}, (errListing, listings) => {
        Video.find({$or: [{"title": new RegExp(req.body.search, "i")}, {"description": new RegExp(req.body.search, "i")}]}, (errVideo, videos) => {
          User.find({name: new RegExp(req.body.search, "i")}, (errUser, users) => {
            // Return any errors
            if (errArticle || errListing || errVideo || errUser) {
              res.status(400).send({
                success: false,
                error: 'Search error.',
              });
            } else {
              // Only return curators or admins, only return relevant info
              const curators = users.filter(user => user.userType !== 'user').map(x => {
                return {name: x.name, _id: x._id, profilePicture: x.profilePicture};
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
        });
      });
    });
  });

  /**
   * Route to receive user's information from Mongo
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
      } else {
          // Find user in Mongo
        User.findById(req.session.passport.user, (err, user) => {
          if (err) {
          // If there was an error with the request
            res.send({
              success: false,
              error: 'Error finding information.',
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
