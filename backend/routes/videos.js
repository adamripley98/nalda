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
const Homepage = require('../models/homepage');

// Import helper methods
const {CuratorOrAdminCheck} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Pull all videos from the database
   */
  router.get('/', (req, res) => {
    // Pulls videos from mongo
    Video.find({})
    .then(videos => {
      // Send videos back in correct order
      videos.reverse();
      // If everything went as planned
      res.send({videos});
    })
    .catch(() => {
      res.status(404).send({error: 'Error finding videos'});
      return;
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
    Video.findById(id)
    .then(video => {
      if (!video) {
        res.status(404).send({error: 'Cannot find video'});
        return;
      }
      // Fetch author data
      User.findById(video.author)
      .then(author => {
        if (!author) {
          res.status(404).send({error: 'Cannot find video'});
          return;
        }
        // By default, user's cannot edit videos
        let canModify = false;
        User.findById(userId)
        .then(user => {
          if (user) {
            // Check if given user is either an admin or the curator of the video
            if (user.userType === 'admin' || user.userType === 'curator') {
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
            video,
            author: authorObj,
            canModify,
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Cannot find video'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Cannot find video'});
        return;
      });
    })
    .catch(() => {
      res.status(404).send({error: 'Cannot find video'});
      return;
    });
  });

  /**
   * Route to handle deleting a specific video
   */
  router.delete('/:id', (req, res) => {
    // Find the id from the video url
    const videoId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      Video.findById(videoId)
      .then(video => {
        video.remove()
        .then(() => {
          // Remove from homepage
          Homepage.find({})
          .then(homepage => {
            const home = homepage[0];
            const videos = home.naldaVideos;
            const banner = home.banner;
            // Delete video from homepage
            for (var i = 0; i < videos.length; i++) {
              if (videos[i].contentId === videoId) {
                videos.splice(i, 1);
                break;
              }
            }
            for (var j = 0; j < banner.length; j++) {
              if (banner[j].contentId === videoId) {
                banner.splice(j, 1);
                break;
              }
            }
            home.save()
            .then(() => {
              res.send({error: ''});
              return;
            })
            .catch(() => {
              res.status(404).send({error: 'Error deleting video.'});
              return;
            });
          })
          .catch(() => {
            res.status(404).send({error: 'Error deleting video.'});
            return;
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Error deleting video.'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error deleting video.'});
        return;
      });
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

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
      // Auth error checking
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate variables
      const {title, description, url, location} = req.body;
      const userId = req.session.passport.user;

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
        res.status(404).send({error});
        return;
      }
        // Find the author
      User.findById(userId)
      .then(author => {
        if (!author) {
          res.status(404).send({error: 'Error editting video'});
          return;
        }
        Video.findById(videoId)
        .then(video => {
          // Make changes to given video
          video.title = title;
          video.description = description;
          video.url = url;
          video.location = location;
          video.updatedAt = new Date().getTime();

          // Save changes in mongo
          video.save()
          .then(() => {
            res.send({video});
            return;
          })
          .catch(() => {
            res.status(404).send({error: 'Error editting video'});
            return;
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Error editting video'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error editting video'});
        return;
      });
    });
  });

  /**
   * Route to handle a new video submission
   * @param title
   * @param url
   * @param description
   */
  router.post('/new', (req, res) => {
    // Check to make sure poster is an admin or curator
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({error: authRes.error});
        return;
      }
      // Isolate variables
      const {title, url, description, location} = req.body;
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
        res.status(404).send({error});
        return;
      }
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
      newVideo.save()
      .then(video => {
        res.send({video});
        return;
      })
      .catch(() => {
        res.status(404).send({error: 'Error posting video'});
        return;
      });
    });
  });

  return router;
};
