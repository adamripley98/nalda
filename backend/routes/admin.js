/**
 * Handles all backend routes for admin related privileges
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const User = require('../models/user');
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');

// Import helper methods
const {AdminCheck} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Route to pull data to admin panel
   */
  router.get('/admin', (req, res) => {
    // Check to make sure admin is logged in
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Declare arrays of data that will be passed back
        const curators = [];
        const admins = [];
        const users = [];

        // Find content
        Article.find({}, (errArticles, articles) => {
          Listing.find({}, (errListings, listings) => {
            Video.find({}, (errVideos, videos) => {
              Homepage.find({}, (errHomepage, homepageContent) => {
                // Send back any errors
                if (errArticles || errListings || errVideos || errHomepage) {
                  res.send({
                    success: false,
                    error: 'Error finding content.',
                  });
                } else {
                  // Find all curators and admins
                  User.find({}, (err, profiles) => {
                    if (err) {
                      res.send({
                        success: false,
                        error: 'Error finding content.',
                      });
                    } else {
                      const userData = {
                        totalUsers: 0,
                        weeklyRegisters: 0,
                      };

                      // Display pertinent information
                      profiles.forEach((user) => {
                        if (user.userType === 'curator') {
                          curators.push({name: user.name, username: user.username, userId: user._id});
                        } else if (user.userType === 'admin') {
                          admins.push({name: user.name, username: user.username, userId: user._id});
                        } else if (user.userType === 'user') {
                          users.push({name: user.name, username: user.username, userId: user._id});
                          // Increment total users
                          userData.totalUsers++;
                          // Count number of users who registered this week
                          if (user._id.getTimestamp() < new Date() - 7) {
                            userData.weeklyRegisters++;
                          }
                        }
                      });
                      // Send back information
                      res.send({
                        success: true,
                        error: '',
                        data: {
                          curators,
                          admins,
                          users,
                          homepageContent: homepageContent[0],
                          userData,
                          articles,
                          listings,
                          videos,
                        }
                      });
                    }
                  });
                }
              });
            });
          });
        });
      }
    });
  });

  /**
   * Route to handle adding new admins
   * Admins are allowed to add more admins/curators and create content
   */
  router.post('/admin/new', (req, res) => {
    // Check to make sure poster is an admin
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // If user is an admin, finds given user to add in Mongo
        User.findOne({username: req.body.userToAdd}, (err, user) => {
          // Lets them know that if there is an error
          if (err) {
            res.send({
              success: false,
              error: 'Error adding admin.',
            });
          // Makes sure that user exists
          } else if (!user) {
            res.send({
              success: false,
              error: req.body.userToAdd + ' does not seem to exist!'
            });
          } else if (user.userType === "admin") {
            res.send({
              success: false,
              error: user.name + ' is already an admin.',
            });
          } else {
            // Makes given user an admin
            user.userType = "admin";
            // Save changes in Mongo
            user.save((errSave) => {
              if (errSave) {
                res.send({
                  success: false,
                  error: "Error saving admin.",
                });
              } else {
                // Create new admin to pass back
                const newAdmin = {
                  name: user.name,
                  username: user.username,
                  userId: user._id,
                };
                // If no error saving new user, returns successfully
                res.send({
                  success: true,
                  data: {
                    newAdmin,
                  },
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
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/new', (req, res) => {
    // Check to make sure poster is an admin
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // If user is an admin, finds given user in Mongo
        User.findOne({username: req.body.userToAdd}, (err, user) => {
          // Lets them know that if there is an error
          if (err) {
            res.send({
              success: false,
              error: "Error adding curator.",
            });
          // Makes sure that user exists
          } else if (!user) {
            res.send({
              success: false,
              error: req.body.userToAdd + ' does not seem to exist!'
            });
          } else if (user.userType === "curator") {
            res.send({
              success: false,
              error: user.name + ' is already a curator.'
            });
          } else if (user.userType === "admin") {
            res.send({
              success: false,
              error: 'Cannot revoke admin privileges.'
            });
          } else {
            // Makes given user an admin
            user.userType = "curator";
            // Save changes in mongo
            user.save((errSave) => {
              if (errSave) {
                res.send({
                  success: false,
                  error: "Error saving curator.",
                });
              } else {
                // Create new admin to pass back
                const newCurator = {
                  name: user.name,
                  username: user.username,
                  userId: user._id,
                };
                // If no error saving new user, returns successfully
                res.send({
                  success: true,
                  error: '',
                  data: {
                    newCurator,
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
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/remove', (req, res) => {
    // Check to make sure poster is an admin
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // finds given user in Mongo
        User.findOne({username: req.body.userToAdd}, (err, user) => {
          // Lets them know that if there is an error
          if (err) {
            res.send({
              success: false,
              error: "Error finding content",
            });
          // Makes sure that user exists
          } else if (!user) {
            res.send({
              success: false,
              error: req.body.userToAdd + ' does not seem to exist!'
            });
          } else {
            // Revokes curator privileges, don't have power to revoke admin privilege though
            if (user.userType === "curator") {
              user.userType = "user";
              // Save changes in mongo
              user.save((errSave) => {
                if (errSave) {
                  res.send({
                    success: false,
                    error: 'Error saving curator.',
                  });
                } else {
                  const removedCurator = {
                    name: user.name,
                    username: user.username,
                    userId: user._id,
                  };
                  // If no error saving new user, returns successfully
                  res.send({
                    success: true,
                    error: '',
                    data: {
                      removedCurator,
                    },
                  });
                }
              });
            } else {
              res.send({
                success: false,
                error: 'Cannot revoke admin privileges.',
              });
            }
          }
        });
      }
    });
  });

  return router;
};
