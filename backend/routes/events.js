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

// Import helper methods
const {CuratorOrAdminCheck} = require('../helperMethods/authChecking');
const {ResizeAndUploadImage} = require('../helperMethods/imageProcessing');

// Export the following methods for routing
module.exports = () => {
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
            // Creates a new listing with given params
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
              res.status(400).send({error: 'Error posting listing.'});
              return;
            });
          });
        });
      });
    });
  });

  return router;
};
