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
const {ResizeAndUploadImage} = require('../helperMethods/imageProcessing');

// Export the following methods for routing
module.exports = () => {
  /**
   * Update a user's profile information
   */
  router.post('/edit', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate variables from the request
      const {
        name,
        bio,
        location,
        profilePicture,
        profilePictureChanged
      } = req.body;

      // Error checking
      let error = '';
      if (!name) {
        error = "Name must be populated.";
      } else if (!name.indexOf(" ")) {
        error = "Name must contain at least 1 space.";
      } else if (bio && bio.length > 1000) {
        error = "Bio cannot be longer than 1000 characters.";
      }

      if (error) {
        res.status(400).send({error});
        return;
      }

      User.findById(req.session.passport.user)
        .then(user => {
          if (!user) {
            res.status(404).send({error: 'Error editting user.'});
            return;
          }
          if (!profilePictureChanged) {
          // Update user with new name
            user.name = name;
            user.location = location;
            user.bio = bio;

            // Save in Mongo
            user.save()
              .then(() => {
                res.send({error: ''});
                return;
              })
              .catch(() => {
                res.status(404).send({error: 'Error editting user.'});
                return;
              });
          } else {
            ResizeAndUploadImage(profilePicture, 'profilepictures', 240, null, (resp) => {
              if (resp.error) {
                res.status(404).send({error: resp.error});
                return;
              }
              // Update the user
              user.profilePicture = resp.resizedImg;
              user.name = name;
              user.location = location;
              user.bio = bio;

              // Save the changes
              user.save()
                .then(() => {
                  res.send({profilePicture: user.profilePicture});
                })
                .catch(() => {
                  res.status(404).send({error: 'Error editting user.'});
                  return;
                });
            });
          }
        })
        .catch(() => {
          res.status(404).send({error: 'Error editting user.'});
          return;
        });
    });
  });

  /**
   * Return a given user's username (the user's email)
   */
  router.get('/username', (req, res) => {
    UserCheck(req, (authRes) => {
      if (!authRes.success) {
        res.status(404).send({error: authRes});
        return;
      }
      User.findById(req.session.passport.user)
        .then(user => {
          res.send({username: user.username});
          return;
        })
        .catch(() => {
          res.status(404).send({error: 'Error finding user'});
          return;
        });
    });
  });

  /**
   * Find a given user's profile information
   */
  router.get('/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Find user's profile in Mongo
    User.findById(id)
      .then(user => {
        if (!user || user.userType === 'user') {
          res.status(404).send({error: 'User does not exist'});
          return;
        }
        Article.find({author: id})
          .then(articles => {
            Listing.find({author: id})
              .then(listings => {
                Video.find({author: id})
                  .then(videos => {
                    res.send({
                      user: {
                        name: user.name,
                        email: user.email,
                        bio: user.bio,
                        userType: user.userType,
                        profilePicture: user.profilePicture,
                        location: user.location,
                      },
                      content: {
                        articles,
                        listings,
                        videos,
                      }
                    });
                    return;
                  })
                  .catch(() => {
                    res.status(404).send({error: 'Error finding user content.'});
                    return;
                  });
              })
              .catch(() => {
                res.status(404).send({error: 'Error finding user content.'});
                return;
              });
          })
          .catch(() => {
            res.status(404).send({error: 'Error finding user content.'});
            return;
          });
      })
      .catch(() => {
        res.status(404).send({error: 'Error finding user content.'});
        return;
      });
  });

  return router;
};
