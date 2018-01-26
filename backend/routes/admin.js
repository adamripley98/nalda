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

// Export the following methods for routing
module.exports = () => {
  /**
   * Route to handle adding new admins
   * Admins are allowed to add more admins/curators and create content
   * @param userToAdd
   */
  router.post('/admin/new', (req, res) => {
    let userId = '';
    // Assign userId to user in backend
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // If user doesn't exist
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.',
      });
    } else {
      // Find the admin in Mongo
      User.findById(userId, (errAdmin, admin) => {
        // Error finding admin
        if (errAdmin) {
          res.send({
            success: false,
            error: errAdmin.message,
          });
        // Can't find admin
        } else if (!admin) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
          // Check if user is an admin
          if (admin.userType !== 'admin') {
            res.send({
              success: false,
              error: 'You must be an admin to post.'
            });
          } else {
            // If user is an admin, finds given user to add in Mongo
            User.findOne({username: req.body.userToAdd}, (err, user) => {
              // Lets them know that if there is an error
              if (err) {
                res.send({
                  success: false,
                  error: err.message,
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
                      error: errSave.message,
                    });
                  } else {
                    // If no error saving new user, returns successfully
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
    }
  });

  /**
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/new', (req, res) => {
    let userId = '';
    // Assign userId to user in backend
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // If user doesn't exist
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.',
      });
    } else {
      // Find the admin in Mongo
      User.findById(userId, (errAdmin, admin) => {
        // Error finding admin
        if (errAdmin) {
          res.send({
            success: false,
            error: errAdmin.message,
          });
        // Can't find admin
        } else if (!admin) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
          // Check if user is an admin
          if (admin.userType !== 'admin') {
            res.send({
              success: false,
              error: 'You must be an admin to post.'
            });
          } else {
            // finds given user in Mongo
            User.findOne({username: req.body.userToAdd}, (err, user) => {
              // Lets them know that if there is an error
              if (err) {
                res.send({
                  success: false,
                  error: err.message,
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
                      error: errSave.message,
                    });
                  } else {
                    // If no error saving new user, returns successfully
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
    }
  });

  /**
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/remove', (req, res) => {
    let userId = '';
    // Assign userId to user in backend
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // If user doesn't exist
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.',
      });
    } else {
      // Find the admin in Mongo
      User.findById(userId, (errAdmin, admin) => {
        // Error finding admin
        if (errAdmin) {
          res.send({
            success: false,
            error: errAdmin.message,
          });
        // Can't find admin
        } else if (!admin) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
          // Check if user is an admin
          if (admin.userType !== 'admin') {
            res.send({
              success: false,
              error: 'You must be an admin to post.'
            });
          } else {
            // finds given user in Mongo
            User.findOne({username: req.body.userToAdd}, (err, user) => {
              // Lets them know that if there is an error
              if (err) {
                res.send({
                  success: false,
                  error: err.message,
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
                        error: errSave.message,
                      });
                    } else {
                      // If no error saving new user, returns successfully
                      res.send({
                        success: true,
                        error: '',
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
        }
      });
    }
  });

  return router;
};
