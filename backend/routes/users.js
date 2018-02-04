/**
 * Handles all backend routes for users - changing information and accessing profiles
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const User = require('../models/user');

// Import helper methods
const {UserCheck} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Update a user's name
   */
  router.post('/name', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Isolate variables from the request
      const name = req.body.name;
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Error checking
        if (!name) {
          res.send({
            success: false,
            error: "Name must be populated",
          });
        } else if (!name.indexOf(" ")) {
          res.send({
            success: false,
            error: "Name must contain at least 1 space",
          });
        } else {
          // The name is properly formatted
          // Search for user in Mongo
          User.findById(req.session.passport.user, (err, user) => {
            // Error finding user
            if (err) {
              res.send({
                success: false,
                error: err.message,
              });
            // User doesn't exist in Mongo
            } else if (!user) {
              res.send({
                success: false,
                error: 'Cannot find user.'
              });
            } else {
              // Update user with new name
              user.name = name;

              // Save in Mongo
              user.save((errUser) => {
                // Error saving user
                if (errUser) {
                  res.send({
                    success: false,
                    error: errUser.message,
                  });
                } else {
                  // User name updated successfully
                  res.send({
                    success: true,
                    error: '',
                  });
                }
              });
            }
          });
        }
      }
    });
  });

  /**
   * Update a user's bio
   */
  router.post('/bio', (req, res) => {
    // Isolate variables from the request
    const bio = req.body.bio;

    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Error checking
        if (bio.length > 500) {
          res.send({
            success: false,
            error: "Bio length cannot exceed 500 characters.",
          });
        } else {
          // Search for user in Mongo
          User.findById(req.session.passport.user, (err, user) => {
            // Error finding user
            if (err) {
              res.send({
                success: false,
                error: err.message,
              });
            // User doesn't exist in Mongo
            } else if (!user) {
              res.send({
                success: false,
                error: 'Cannot find user.'
              });
            } else {
              // Update user with new bio
              user.bio = bio;
              // Save in Mongo
              user.save((errUser) => {
                // Error saving user
                if (errUser) {
                  res.send({
                    success: false,
                    error: errUser.message,
                  });
                } else {
                  // User bio updated successfully
                  res.send({
                    success: true,
                    error: '',
                  });
                }
              });
            }
          });
        }
      }
    });
  });

  /**
   * Update a user's profile picture
   * @param userId
   * @param profilePicture
   */
  router.post('/profilePicture', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Isolate variables
      const profilePicture = req.body.profilePicture;
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const imgRegexp = /\.(jpeg|jpg|gif|png)$/;
        // TODO should only need to contain, not end in
        if (req.body.profilePicture && !imgRegexp.test(req.body.profilePicture)) {
          res.send({
            success: false,
            error: "Image url must end in \"jpeg\", \"png\", \"gif\", or \"jpg\".",
          });
        } else {
          // find and update given user
          User.findById(req.session.passport.user, (err, user) => {
            if (err) {
              // Error finding user
              res.send({
                success: false,
                error: err.message,
              });
            } else if (!user) {
              res.send({
                success: false,
                error: 'User cannot be found.',
              });
            } else {
              // Update the user
              user.profilePicture = profilePicture;
              // Save the changes
              user.save((errSave) => {
                if (err) {
                  res.send({
                    success: false,
                    error: errSave.message,
                  });
                } else {
                  res.send({
                    success: true,
                    error: '',
                  });
                }
              });
            }
          });
        }
      }
    });
  });

  /**
   * Update a user's location
   * @param location
   */
  router.post('/location', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        User.findById(req.session.passport.user, (err, user) => {
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
            // Update the user's location
            user.location = req.body.location;
            // Save the changes in Mongo
            user.save((errSave) => {
              if (errSave) {
                res.send({
                  success: false,
                  error: errSave.message,
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                });
              }
            });
          }
        });
      }
    });
  });

  /**
   * Find a given user's profile
   */
  router.get('/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Find user's profile in Mongo
    User.findById(id, (err, user) => {
      // Error finding user
      if (err) {
        res.send({
          success: false,
          error: err.message,
        });
      } else if (!user) {
        // User doesn't exist in mongo
        res.send({
          success: false,
          error: 'User does not exist.'
        });
      // Otherwise render user data
      } else if (user.userType === 'user') {
        res.send({
          success: false,
          error: 'User does not exist.',
        });
      } else {
        Article.find({author: id}, (errArticles, articles) => {
          // Error checking
          if (errArticles) {
            res.send({
              success: false,
              error: errArticles.message,
            });
          } else {
            Listing.find({author: id}, (errListings, listings) => {
              if (errListings) {
                res.send({
                  success: false,
                  error: errListings.message,
                });
              } else {
                Video.find({author: id}, (errVideo, videos) => {
                  if (errVideo) {
                    res.send({
                      success: false,
                      error: errVideo.message,
                    });
                  } else {
                    // Remove private data before sending back
                    // TODO Remove private data better
                    user.password = "";
                    res.send({
                      success: true,
                      error: '',
                      data: user,
                      articles,
                      listings,
                      videos,
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

  return router;
};
