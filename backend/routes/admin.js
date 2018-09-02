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
const Event = require('../models/event');

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
    } else if (component.contentType === 'Events') {
      Model = Event;
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
          articles,
        });
      })
      .catch(err => {
        res.status(404).send({
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
          listings,
        });
      })
      .catch(err => {
        res.status(404).send({
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
          videos,
        });
      })
      .catch(err => {
        res.status(404).send({
          error: err.message,
        });
      });
  });

  /**
   * Get a list of all videos
   */
  router.get('/admin/events', (req, res) => {
    Event.find()
      .then(fullEvents => {
        const events = fullEvents.map(event => ({
          _id: event._id,
          title: event.title,
        }));
        res.send({
          events,
        });
      })
      .catch(err => {
        res.status(404).send({
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
          admins,
        });
      })
      .catch(err => {
        res.status(404).send({
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
          curators,
        });
      })
      .catch(err => {
        res.status(404).send({
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
          users: userObjs,
        });
      })
      .catch(err => {
        res.send({
          error: err.message,
        });
      });
  });

  /**
   * Get a list of all admin, curators, and users
   */
  router.get('/admin/all', (req, res) => {
    User.find({})
      .then(allUsers => {
      // Filter and display important info for different types of users
        const users = allUsers.filter(user => user.userType === 'user').map(user => ({
          _id: user._id,
          name: user.name,
          username: user.username,
        }));
        const curators = allUsers.filter(user => user.userType === 'curator').map(user => ({
          _id: user._id,
          name: user.name,
          username: user.username,
        }));
        const admins = allUsers.filter(user => user.userType === 'admin').map(user => ({
          _id: user._id,
          name: user.name,
          username: user.username,
        }));
        // Send the results
        res.send({
          users,
          curators,
          admins,
        });
      })
      .catch(err => {
        res.status(404).send({error: err.message});
      });
  });

  /**
   * Route to pull data to admin panel
   */
  router.get('/admin', (req, res) => {
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(404).send({
          error: authRes.error,
        });
        return;
      }

      // Find content
      Homepage.find({}, (errHomepage, home) => {
        // Send back any errors
        if (errHomepage) {
          res.status(404).send({
            error: 'Error finding content.',
          });
          return;
        }

        const homepage = home[0];
        pullData(homepage.components, (resp) => {
          if (!resp.success) {
            res.status(404).send({
              error: resp.error,
            });
          } else {
            const homepageContent = {
              banner: homepage.banner,
              components: resp.returnComponents,
            };

            // Send back information
            res.send({homepageContent});
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
        res.status(404).send({
          error: authRes.error,
        });
        return;
      }
      // If user is an admin, finds given user to add in Mongo
      User.findOne({username: req.body.userToAdd})
        .then(user => {
        // Check for errors
          let error = '';
          if (!user) {
            error = req.body.userToAdd + ' does not seem to exist!';
          } else if (user.userType === "admin") {
            error = user.name + ' is already an admin.';
          }

          if (error) {
            res.status(404).send({error});
            return;
          }
          // Makes given user an admin
          user.userType = "admin";
          // Save changes in Mongo
          user.save()
            .then(() => {
              // If no error saving new user, returns successfully
              res.send({
                newAdmin: {
                  name: user.name,
                  username: user.username,
                  userId: user._id,
                }
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error saving admin'});
            });
        })
        .catch(err => {
          res.status(404).send({error: err.message});
        });
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
        res.status(404).send({
          error: authRes.error,
        });
        return;
      }

      // If user is an admin, finds given user in Mongo
      User.findOne({username: req.body.userToAdd})
        .then(user => {
        // Error checking
          let error = '';
          if (!user) {
            error = req.body.userToAdd + ' does not seem to exist!';
          } else if (user.userType === "curator") {
            error = user.name + ' is already a curator.';
          } else if (user.userType === "admin") {
            error = 'Cannot revoke admin privileges.';
          }

          if (error) {
            res.status(404).send(error);
            return;
          }

          // Makes given user an admin
          user.userType = "curator";
          // Save changes in mongo
          user.save()
            .then(() => {
              // If no error saving new user, returns successfully
              res.send({
                newCurator: {
                  name: user.name,
                  username: user.username,
                  userId: user._id,
                }
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error saving curator'});
            });
        })
        .catch(err => {
          res.status(404).send({error: err.message});
        });
    });
  });

  /**
   * Route to handle removing curators
   * @param userToRemove
   */
  router.post('/curator/remove', (req, res) => {
    // Check to make sure poster is an admin
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }

      // Finds given user in Mongo
      User.findOne({username: req.body.userToRemove})
        .then(user => {
          let error = '';
          if (!user) {
            error = req.body.userToAdd + ' does not seem to exist!';
          } else if (user.userType !== 'curator') {
            error = 'Cannot revoke privileges.';
          }

          if (error) {
            res.status(404).send({error});
            return;
          }
          // Revokes curator privileges, don't have power to revoke admin privilege though
          user.userType = "user";
          user.save()
            .then(() => {
              // If no error saving new user, returns successfully
              res.send({
                success: true,
                error: '',
                removedCurator: {
                  name: user.name,
                  username: user.username,
                  userId: user._id,
                },
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error saving curator'});
            });
        })
        .catch(() => {
          res.status(404).send({error: 'Error removing user.'});
        });
    });
  });

  return router;
};
