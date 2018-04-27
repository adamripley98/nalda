/**
 * Handles all backend routes for admin related privileges
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');

// Import database models
const User = require('../models/user');
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');

// Import helper methods
const {AdminCheck} = require('../helperMethods/authChecking');

// Helper function to pull data for each of the different content types
const pullData = (components, callback) => {
  // Array of content to be returned
  const returnComponents = [];

  // Loop through array and pull pertinent data
  async.eachSeries(components, (component, cb) => {
    // Find the model for pulling data based on the content type
    let Model = null;
    if (component.contentType === 'Articles') {
      Model = Article;
    } else if (component.contentType === 'Listings') {
      Model = Listing;
    } else if (component.contentType === 'Videos') {
      Model = Video;
    } else return;

    // Find all of the content associated with the component
    if (component.content && component.content.length) {
      const returnContent = [];
      async.forEach(component.content, (cont, contentCallback) => {
        Model.findById(cont.contentId, (errContent, content) => {
          if (errContent || !content) {
            callback({
              success: false,
              error: 'Error fetching homepage content',
            });
          } else {
            returnContent.push({
              contentType: component.contentType,
              contentId: cont.contentId,
              title: content.title,
            });
            contentCallback();
          }
        });
      }, contentAsyncErr => {
        if (contentAsyncErr) {
          cb();
        } else {
          component.content = returnContent;
          returnComponents.push(component);
          cb();
        }
      });
    } else {
      returnComponents.push(component);
      cb();
    }
  }, (asyncErr) => {
    if (asyncErr) {
      callback({
        success: false,
        error: 'Error loading homepage.'
      });
      return;
    }

    callback({
      success: true,
      error: '',
      returnComponents,
    });
  });
};

// Export the following methods for routing
module.exports = () => {
  /**
   * Get a list of all articles
   */
  router.get('/admin/articles', (req, res) => {
    Article.find()
      .then(fullArticles => {
        const articles = fullArticles.map(article => ({
          _id: article._id,
          title: article.title,
        }));
        res.send({
          success: true,
          articles,
        });
      })
      .catch(err => {
        res.send({
          success: false,
          error: err.message,
        });
      });
  });

  /**
   * Get a list of all listings
   */
  router.get('/admin/listings', (req, res) => {
    Listing.find()
      .then(fullListings => {
        const listings = fullListings.map(listing => ({
          _id: listing._id,
          title: listing.title,
        }));
        res.send({
          success: true,
          listings,
        });
      })
      .catch(err => {
        res.send({
          success: false,
          error: err.message,
        });
      });
  });

  /**
   * Get a list of all videos
   */
  router.get('/admin/videos', (req, res) => {
    Video.find()
      .then(fullVideos => {
        const videos = fullVideos.map(video => ({
          _id: video._id,
          title: video.title,
        }));
        res.send({
          success: true,
          videos,
        });
      })
      .catch(err => {
        res.send({
          success: false,
          error: err.message,
        });
      });
  });

  /**
   * Get a list  of all admins
   */
  router.get('/admin/admins', (req, res) => {
    User.find({ userType: 'admin' })
      .then(users => {
        const admins = users.map(user => ({
          _id: user._id,
          name: user.name,
          username: user.username,
        }));
        res.send({
          success: true,
          admins,
        });
      })
      .catch(err => {
        res.send({
          success: false,
          error: err.message,
        });
      });
  });

  /**
   * Get a list  of all curators
   */
  router.get('/admin/curators', (req, res) => {
    User.find({ userType: 'curator' })
      .then(users => {
        const curators = users.map(user => ({
          _id: user._id,
          name: user.name,
          username: user.username,
        }));
        res.send({
          success: true,
          curators,
        });
      })
      .catch(err => {
        res.send({
          success: false,
          error: err.message,
        });
      });
  });

  /**
   * Get a list of all normal users
   */
  router.get('/admin/users', (req, res) => {
    User.find({ userType: 'user' })
      .then(users => {
        const userObjs = users.map(user => ({
          _id: user._id,
          name: user.name,
          username: user.username,
        }));
        res.send({
          success: true,
          users: userObjs,
        });
      })
      .catch(err => {
        res.send({
          success: false,
          error: err.message,
        });
      });
  });

  /**
   * Route to pull data to admin panel
   */
  router.get('/admin', (req, res) => {
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
        return;
      }

      // Find content
      Homepage.find({}, (errHomepage, homepageContent) => {
        // Send back any errors
        if (errHomepage) {
          res.send({
            success: false,
            error: 'Error finding content.',
          });
          return;
        }

        const homepage = homepageContent[0];
        pullData(homepage.components, (resp) => {
          if (!resp.success) {
            res.send({
              success: false,
              error: resp.error,
            });
          } else {
            const home = {
              banner: homepage.banner,
              components: resp.returnComponents,
            };

            // Send back information
            res.send({
              success: true,
              error: '',
              data: {
                homepageContent: home,
              }
            });
          }
        });
      });
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
