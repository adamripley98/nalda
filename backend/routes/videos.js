/**
 * Handles all backend routes for videos
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const Video = require('../models/video');
const User = require('../models/user');

// Import helper methods
const {notCuratorOrAdmin} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Pull all videos from the database
   */
  router.get('/', (req, res) => {
    // Pulls videos from mongo
    Video.find((err, videos) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err.message,
        });
      } else {
        // Send videos back in correct order
        videos.reverse();
        // If everything went as planned
        res.send({
          success: true,
          data: videos,
        });
      }
    });
  });

  /**
   * Pull a specific video from the database
   */
  router.get('/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Check if user is logged in
    let userId = "";
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Pull specific video from mongo
    Video.findById(id, (err, video) => {
      if (err) {
        res.send({
          success: false,
          error: err.message,
        });
      // If the video doesn't exist
      } else if (!video) {
        res.send({
          success: false,
          error: "Video not found",
        });
      // if no errors, return video
      } else {
        // Fetch author data
        User.findById(video.author, (er, author) => {
          if (er) {
            // Error finding author
            res.send({
              success: false,
              error: er.message,
            });
          } else if (!author) {
            res.send({
              success: false,
              error: 'Cannot find author.',
            });
          } else {
            // By default, user's cannot edit videos
            let canModify = false;
            User.findById(userId, (errUser, user) => {
              if (user) {
                // Check if given user is either an admin or the curator of the video
                if (user.userType === 'admin' || user._id === video.author) {
                  canModify = true;
                }
              }

              // Add the author's information to the video
              const authorObj = {
                name: author.name,
                _id: author._id,
                profilePicture: author.profilePicture,
              };

              // Send back data
              res.send({
                success: true,
                data: video,
                author: authorObj,
                canModify,
              });
            });
          }
        });
      }
    });
  });

  /**
   * Route to handle deleting a specific video
   */
  router.delete('/:id', (req, res) => {
    // Find the id from the video url
    const id = req.params.id;

    // Pull userId from the backend
    let userId = '';
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Find the given video in Mongo and delete it
    Video.findById(id, (errVideo, video) => {
      // Error finding video
      if (errVideo) {
        res.send({
          success: false,
          error: errVideo.message,
        });
      // Cannot find video
      } else if (!video) {
        res.send({
          success: false,
          error: 'No video found.',
        });
      } else {
        // Check to make sure user is logged in on backend
        if (!userId) {
          res.send({
            success: false,
            error: 'You must be logged in to delete videos.',
          });
        } else {
          // Find user to check if they can delete docs
          User.findById(userId, (errUser, user) => {
            // Error finding user
            if (errUser) {
              res.send({
                success: false,
                error: errUser.message,
              });
            // Cannot find user
            } else if (!user) {
              res.send({
                success: false,
                error: 'You must be logged in.'
              });
            } else {
              // User found, check if user has privileges to delete a video (author or admin)
              if (user.userType === 'admin' || user._id === video.author) {
                // User CAN delete videos, remove from mongo
                video.remove((errRemove) => {
                  if (errRemove) {
                    res.send({
                      success: false,
                      error: errRemove.message,
                    });
                  // Send back success
                  } else {
                    res.send({
                      success: true,
                      error: '',
                    });
                  }
                });
              } else {
                // User CANNOT delete videos
                res.send({
                  success: false,
                  error: 'You do not have privileges to delete videos.'
                });
              }
            }
          });
        }
      }
    });
  });

  /**
   * Route to handle editing a listing
   * @param title
   * @param description
   * @param url
   * @param location
   */
  router.post('/:id/edit', (req, res) => {
    // Find the id from the url
    const videoId = req.params.id;

    // Isolate userId from Backend
    let userId = "";
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Begin error checking
    if (!userId) {
      res.send({
        success: false,
        error: 'You must be logged in to edit.'
      });
    } else {
      User.findById(userId, (errUser, user) => {
        if (errUser) {
          res.send({
            success: false,
            error: errUser.message,
          });
        } else {
          if (user.userType !== 'admin' && user.userType !== 'curator') {
            res.send({
              success: false,
              error: 'General users cannot edit videos.',
            });
          } else {
            // Isolate variables
            const title = req.body.title;
            const description = req.body.description;
            const url = req.body.url;
            const location = req.body.location;

            // Keep track of any errors
            let error = "";
            const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

            // Perform error checking on variables
            if (!title) {
              error = "Title must be populated.";
            } else if (!description) {
              error = "Description must be populated.";
            } else if (!urlRegexp.test(url)) {
              error = "Image must be a valid URL.";
            } else if (Object.keys(location).length === 0) {
              error = "Location must be populated.";
            }

            // If there was an error or not
            if (error) {
              res.send({
                success: false,
                error,
              });
            } else {
              // Find the author
              User.findById(userId, (err, author) => {
                if (err) {
                  res.send({
                    success: false,
                    error: 'Error finding author ' + err.message
                  });
                } else if (!author) {
                  res.send({
                    success: false,
                    error: 'Author not found.'
                  });
                } else {
                  // Find video in Mongo
                  Video.findById(videoId, (videoErr, video) => {
                    if (videoErr) {
                      res.send({
                        success: false,
                        error: videoErr.message,
                      });
                    } else {
                      // Make changes to given video
                      video.title = title;
                      video.description = description;
                      video.url = url;
                      video.location = location;
                      video.updatedAt = new Date().getTime();

                      // Save changes in mongo
                      video.save((errSave) => {
                        if (errSave) {
                          res.send({
                            success: false,
                            error: errSave.message,
                          });
                        } else {
                          res.send({
                            success: true,
                            error: '',
                            data: video,
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        }
      });
    }
  });


  /**
   * Route to handle a new video submission
   * @param title
   * @param url
   * @param description
   */
  router.post('/new', (req, res) => {
    // Check to make sure poster is an admin or curator
    const authError = notCuratorOrAdmin(req);

    // Return any authentication errors
    if (authError) {
      res.send({
        success: false,
        error: authError,
      });
    } else {
      // Isolate variables
      const title = req.body.title;
      const url = req.body.url;
      const description = req.body.description;
      const location = req.body.location;
      const userId = req.session.passport.user;

      let error = "";
      const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

      // Perform error checking on variables
      if (!title) {
        error = "Title must be populated.";
      } else if (!description) {
        error = "Subtitle must be populated.";
      } else if (!urlRegexp.test(url)) {
        error = "Image must be a valid URL to an image.";
      }

      // If there was an error or not
      if (error) {
        res.send({
          success: false,
          error,
        });
      } else {
        // Create a new video with given data
        const newVideo = new Video({
          title,
          url,
          description,
          author: userId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          location,
        });

      // Save the new video in Mongo
        newVideo.save((errVideo, video) => {
          if (errVideo) {
            // If there was an error saving the video
            res.send({
              success: false,
              error: errVideo.message,
            });
          } else {
            // Successfully send back data
            res.send({
              success: true,
              data: video,
            });
          }
        });
      }
    }
  });

  return router;
};
