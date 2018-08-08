/**
 * Handles all backend routes for events
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');

// Import database models
const Event = require('../models/event');
const User = require('../models/user');
const Homepage = require('../models/homepage');


// Import helper methods
const {CuratorOrAdminCheck} = require('../helperMethods/authChecking');
const {ResizeAndUploadImage, DeleteImages} = require('../helperMethods/imageProcessing');

// Export the following methods for routing
module.exports = () => {
  // Route to pull all events
  router.get('/', (req, res) => {
    // Pulls events from mongo
    Event.find({})
    .then(events => {
      // Send events back in correct order
      events.reverse();
      // If everything went as planned
      res.send({events});
    })
    .catch(() => {
      res.status(404).send({error: 'Error finding events.'});
    });
  });

  /**
   * Route to handle pulling the information for a specific event
   */
  router.get('/:id', (req, res) => {
    // Find the id from the event url
    const id = req.params.id;

    // Check if user is logged in
    const userId = req.session.passport ? req.session.passport.user : null;

    Event.findById(id)
    .then(event => {
      if (!event) {
        res.status(404).send({error: 'Error pulling event.'});
        return;
      }
      User.findById(event.author)
      .then(author => {
        if (!author) {
          res.status(404).send({error: 'Error pulling event.'});
          return;
        }
        // Default: users can't change event
        let canModify = false;
        User.findById(userId)
        .then(user => {
          if (user) {
            // Check if given user is either an admin or the curator of the event
            if (user.userType === 'admin' || user.userType === 'curator') {
              canModify = true;
            }

            // Send back data
            res.send({
              author,
              event,
              timestamp: event._id.getTimestamp(),
              canModify,
            });
          }
        })
        .catch(() => {
          res.status(404).send({error: 'Error pulling event.'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error pulling event.'});
        return;
      });
    })
    .catch(() => {
      res.status(404).send({error: 'Error pulling event.'});
      return;
    });
  });

  // Route to create a new event
  router.post('/new', (req, res) => {
    // Check to make sure poster is an admin or curator
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate variables from the body
      const { title, description, requirements, image, images, startDate, endDate, price, website, categories, location } = req.body;
      const userId  = req.session.passport.user;

      let error = "";

      // Error checking
      if (!title) {
        error = "Title must be populated.";
      } else if (!description) {
        error = "Description must be populated.";
      } else if (!startDate) {
        error = "Start Date must be populated.";
      } else if (!endDate) {
        error = "End Date must be populated.";
      } else if (!image) {
        error = "Hero image must be populated.";
      } else if (!requirements || !requirements.length) {
        error = "Requirements must be populated.";
      } else if (images && images.length > 10) {
        error = "Maximum of 10 images.";
      } else if (!price) {
        error = "Price must be populated.";
      } else if (!location.name) {
        error = "Location must be populated.";
      } else if (!location.lat || !location.lng) {
        error = "Location must be valid.";
      }

      // Handle error if there is one
      if (error) {
        res.status(400).send({error});
        return;
      }
      ResizeAndUploadImage(image, 'eventpictures', 1920, title, resp1 => {
        if (resp1.error) {
          res.status(400).send({error: resp1.error});
          return;
        }
        ResizeAndUploadImage(image, 'eventpictures', 600, title, resp2 => {
          if (resp2.error) {
            res.status(400).send({error: resp2.error});
            return;
          }
          const newImages = [];
          async.eachSeries(images, (img, cb) => {
            ResizeAndUploadImage(img, 'eventpictures', 800, title, resp3 => {
              if (resp3.error) {
                res.status(400).send({error: resp3.error});
                return;
              }
              newImages.push(resp3.resizedImg);
              cb();
            });
          }, (asyncErr) => {
            if (asyncErr) {
              res.status(400).send({error: 'Error posting event.'});
              return;
            }
            // Creates a new event with given params
            const newEvent = new Event({
              title,
              description,
              startDate,
              endDate,
              image: resp1.resizedImg,
              imagePreview: resp2.resizedImg,
              images: newImages,
              requirements,
              price,
              website,
              categories,
              location,
              author: userId,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });

            // Save the new article in mongo
            newEvent.save()
            .then(event => {
              // Send the data along if it was successfully stored
              res.send({event});
            })
            .catch(() => {
              res.status(400).send({error: 'Error posting event.'});
              return;
            });
          });
        });
      });
    });
  });

  // Route to handle editting an event
  router.post('/:id/edit', (req, res) => {
    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
        // Auth error
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate variables
      const userId = req.session.passport.user;
      const eventId = req.params.id;
      const { title, description, requirements, image, images, startDate, endDate, price, website, categories, location } = req.body;

      // Keep track of any errors
      let error = "";

      // Perform error checking on variables
      if (!title) {
        error = "Title must be populated.";
      } else if (!description) {
        error = "Description must be populated.";
      } else if (!startDate) {
        error = "Start Date must be populated.";
      } else if (!endDate) {
        error = "End Date must be populated.";
      } else if (!image) {
        error = "Hero image must be populated.";
      } else if (!requirements || !requirements.length) {
        error = "Requirements must be populated.";
      } else if (images && images.length > 10) {
        error = "Maximum of 10 images.";
      } else if (!price) {
        error = "Price must be populated.";
      } else if (!location.name) {
        error = "Location must be populated.";
      } else if (!location.lat || !location.lng) {
        error = "Location must be valid.";
      }

      // If there was an error or not
      if (error) {
        res.status(404).send({error});
        return;
      }
      let mainImg = image;
      let previewImg = image;
      // If initial image is new, upload to s3
      const awaitMainImageUpload = new Promise(resolve => {
        if (image.indexOf('s3.amazonaws') === -1) {
          ResizeAndUploadImage(image, 'eventpictures', 1920, title, (resp1) => {
            if (resp1.error) {
              resolve(res.status(404).send({error: resp1.error}));
              return;
            }
            // Make a preview version for performance
            ResizeAndUploadImage(image, 'eventpictures', 600, title, (resp2) => {
              if (resp2.error) {
                resolve(res.status(404).send({error: resp2.error}));
                return;
              }
              // For scope reasons
              mainImg = resp1.resizedImg;
              previewImg = resp2.resizedImg;
              resolve();
            });
          });
        } else {
          // If initial image has already been uploaded, simply move on
          resolve();
        }
      });
      // Now loop through the other images
      awaitMainImageUpload.then(() => {
        const newImages = [];
        async.eachSeries(images, (img, cb) => {
          // New image is actually new
          if (img.indexOf('s3.amazonaws') === -1) {
            ResizeAndUploadImage(img, 'eventpictures', 800, title, (resp3) => {
              if (resp3.error) {
                res.status(404).send({error: resp3.error});
                return;
              }
              newImages.push(resp3.resizedImg);
              cb();
            });
          } else {
            // new image has already been uploaded
            newImages.push(img);
            cb();
          }
        }, (asyncErr) => {
          if (asyncErr) {
            res.status(400).send({error: 'Error editting.'});
            return;
          }
          // Find the author
          User.findById(userId)
          .then(author => {
            if (!author) {
              res.status(404).send({error: 'Error editting event'});
              return;
            }
            Event.findById(eventId)
            .then(event => {
              // Make changes to given event
              event.title = title;
              event.description = description;
              event.image = mainImg;
              event.imagePreview = previewImg;
              event.images = newImages;
              event.price = price;
              event.location = location;
              event.categories = categories;
              event.website = website;
              event.requirements = requirements;
              event.startDate = startDate;
              event.endDate = endDate;
              event.updatedAt = new Date().getTime();

              // Save changes in mongo
              event.save()
              .then(() => {
                res.send({event});
                return;
              })
              .catch(() => {
                res.status(404).send({error: 'Error editting event'});
                return;
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error editting event'});
              return;
            });
          })
          .catch(() => {
            res.status(404).send({error: 'Error editting event'});
            return;
          });
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error editting event'});
        return;
      });
    });
  });

  /**
   * Route to handle deleting a specific event
   */
  router.delete('/:id', (req, res) => {
    // Find the id from the event url
    const eventId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
        // Auth error
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      Event.findById(eventId)
      .then(event => {
        event.remove()
        .then(() => {
          Homepage.find({})
          .then(homepage => {
            const home = homepage[0];
            const banner = home.banner.slice();
            // Remove content from banner
            for (var j = 0; j < banner.length; j++) {
              if (banner[j].contentId === eventId) {
                banner.splice(j, 1);
                break;
              }
            }
            // Delete component from homepage
            const components = home.components.slice();
            components.forEach((comp, i) => {
              comp.content.forEach((content, k) => {
                if (content.contentId === eventId) {
                  components[i].content.splice(k, 1);
                }
              });
            });
            // Save changes
            home.banner = banner;
            home.components = components;
            home.save()
            .then(() => {
              // Delete images from AWS
              DeleteImages('eventpictures', event.title, resp => {
                if (resp.error) {
                  res.status(400).send({error: resp.error});
                  return;
                }
                // No errors
                res.send({'error': ''});
                return;
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error deleting event.'});
              return;
            });
          })
          .catch(() => {
            res.status(404).send({error: 'Error deleting event.'});
            return;
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Error deleting event.'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error deleting event.'});
        return;
      });
    });
  });

  return router;
};
