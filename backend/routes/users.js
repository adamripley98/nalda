/**
 * Handles all backend routes for users - changing information and accessing profiles
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const uuid = require('uuid-v4');
const sharp = require('sharp');

// Import database models
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const User = require('../models/user');

// Import helper methods
const {UserCheck} = require('../helperMethods/authChecking');

// Isolate environmental variables
const {AWS_BUCKET_NAME, AWS_USER_KEY, AWS_USER_SECRET} = process.env;

// Set up bucket
const s3bucket = new AWS.S3({
  accessKeyId: AWS_USER_KEY,
  secretAccessKey: AWS_USER_SECRET,
  Bucket: AWS_BUCKET_NAME,
});

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
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate variables from the request
        const {
          name,
          bio,
          location,
          profilePicture,
          profilePictureChanged
        } = req.body;

        // Error checking
        if (!name) {
          res.send({
            success: false,
            error: "Name must be populated.",
          });
        } else if (!name.indexOf(" ")) {
          res.send({
            success: false,
            error: "Name must contain at least 1 space.",
          });
        } else if (bio && bio.length > 1000) {
          res.send({
            success: false,
            error: "Bio cannot be longer than 1000 characters.",
          });
        } else {
          // The name is properly formatted
          // Search for user in Mongo
          User.findById(req.session.passport.user, (err, user) => {
            // Error finding user
            if (err) {
              res.send({
                success: false,
                error: 'Something went wrong. Check the form and try again.',
              });
            } else if (!user) {
              // User doesn't exist in Mongo
              res.send({
                success: false,
                error: 'Cannot find user.'
              });
            } else if (!profilePictureChanged) {
              // Update user with new name
              user.name = name;
              user.location = location;
              user.bio = bio;

              // Save in Mongo
              user.save(userErr => {
                // Error saving user
                if (userErr) {
                  res.send({
                    success: false,
                    error: 'Failed to update account information. Check the form and try again.',
                  });
                } else {
                  // User name updated successfully
                  res.send({
                    success: true,
                    error: '',
                  });
                }
              });
            } else {
              // Convert profile picture to a form that s3 can display
              const profilePictureConverted = new Buffer(profilePicture.replace(/^data:image\/\w+;base64,/, ""), 'base64');

              // Resize to be appropriate size
              sharp(profilePictureConverted)
              .resize(240, null)
              .toBuffer()
              .then( resized => {
                // Create bucket
                s3bucket.createBucket(() => {
                  const params = {
                    Bucket: AWS_BUCKET_NAME,
                    Key: `profilepictures/${uuid()}`,
                    ContentType: 'image/jpeg',
                    Body: resized,
                    ContentEncoding: 'base64',
                    ACL: 'public-read',
                  };

                  // Upload photo
                  s3bucket.upload(params, (errUpload, data) => {
                    if (errUpload) {
                      res.send({
                        success: false,
                        error: 'Error uploading profile picture.',
                      });
                    } else {
                      // Update the user
                      user.profilePicture = data.Location;
                      user.name = name;
                      user.location = location;
                      user.bio = bio;

                      // Save the changes
                      user.save(userErr => {
                        if (userErr) {
                          res.send({
                            success: false,
                            error: 'There was an error updating your account information. Check the form and try again.',
                          });
                        } else {
                          res.send({
                            success: true,
                            error: '',
                            data: user.profilePicture,
                          });
                        }
                      });
                    }
                  });
                });
              })
              .catch(() => {
                res.send({
                  success: false,
                  error: 'Error changing profile picture.',
                });
              });
            }
          });
        }
      }
    });
  });

  /**
   * Return a given user's username (the user's email)
   */
  router.get('/username', (req, res) => {
    UserCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes,
        });
      } else {
        User.findById(req.session.passport.user, (err, user) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error finding user.',
            });
          } else {
            res.send({
              success: true,
              data: user.username,
            });
          }
        });
      }
    });
  });

  /**
   * Find a given user's profile information
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
              error: 'Error finding user.',
            });
          } else {
            Listing.find({author: id}, (errListings, listings) => {
              if (errListings) {
                res.send({
                  success: false,
                  error: 'Error finding user.',
                });
              } else {
                Video.find({author: id}, (errVideo, videos) => {
                  if (errVideo) {
                    res.send({
                      success: false,
                      error: 'Error finding user.',
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
