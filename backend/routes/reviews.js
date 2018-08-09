/**
 * Handles all backend routes for reviews
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');

// Import database models
const Listing = require('../models/listing');
const User = require('../models/user');

// Import helper methods
const {UserCheck} = require('../helperMethods/authChecking');
const {ReviewCheck} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Route to delete a review
   * @param reviewId
   * @param listingId
   **/
  router.delete('/', (req, res) => {
    // Isolate variables
    const reviewId = req.body.reviewId;
    const listingId = req.body.listingId;

    // Check to make sure poster is able to delete reviews
    ReviewCheck(req, reviewId, listingId, (authRes) => {
      // Authentication error
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate variable
      const listing = authRes.listing;
      const reviews = [];
      // Delete review
      if (listing && listing.reviews && listing.reviews.length) {
        listing.reviews.forEach((rev) => {
          if (rev._id.toString() !== reviewId) {
            reviews.push(rev);
          }
        });
      }
      // Update reviews
      listing.reviews = reviews;
      // Save in mongo
      listing.save()
      .then(() => {
        res.send({error: ''});
        return;
      })
      .catch(() => {
        res.status(404).send({error: 'Error deleting review'});
        return;
      });
    });
  });

  /**
   * Route to add a new review
   * TODO error checking
   * @param userId
   * @param listingId
   * @param rating
   * @param title
   * @param content
   */
  router.post('/new', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      const userId = req.session.passport.user;
      // Ensure all fields are populated before leaving review
      if (!req.body.rating || !req.body.title || !req.body.content) {
        res.status(404).send({error: 'All fields must be populated.'});
        return;
      }
      User.findById(userId)
      .then(user => {
        // If user doesn't exist
        if (!user) {
          res.status(404).send({error: 'User does not exist.'});
          return;
        }
        // If no errors can now save new reviews
        Listing.findById(req.body.listingId)
        .then(listing => {
          // Listing doesn't exist for some reason
          if (!listing) {
            res.status(404).send({error: 'Error posting review.'});
            return;
          }
          // If listing has been found, update it with review
          const currentReviews = listing.reviews;

          // Check if user has already left a review
          let leftReviewAlready = false;
          async.each(currentReviews, (review, callback) => {
            if (review.authorId === user._id.toString()) {
              leftReviewAlready = true;
            }
            // Continue looping
            callback();
          }, asyncErr => {
            if (asyncErr) {
              res.status(404).send({error: 'Error posting review.'});
              return;
            }
            // If already left a review send back error
            if (leftReviewAlready) {
              res.status(404).send({error: "Users may only leave one review."});
              return;
            }
            // Add new review to array of current reviews
            currentReviews.push({
              rating: req.body.rating,
              title: req.body.title,
              content: req.body.content,
              createdAt: new Date().getTime(),
              authorId: userId,
            });
            // Update listing with new review
            listing.reviews = currentReviews;
            // Resave listing in Mongo
            listing.save()
            .then(() => {
              res.send({error: ''});
              return;
            })
            .catch(() => {
              res.status(404).send({error: 'Error saving review'});
              return;
            });
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Error saving review'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error saving review'});
        return;
      });
    });
  });

  return router;
};
