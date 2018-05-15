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
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate variable
        const listing = authRes.listing;
        const reviews = [];
        // Delete review
        // TODO Do this better
        listing.reviews.forEach((rev) => {
          if (rev._id.toString() !== reviewId) {
            reviews.push(rev);
          }
        });
        // Update reviews
        listing.reviews = reviews;
        // Save in mongo
        listing.save((errSave) => {
          if (errSave) {
            res.send({
              success: false,
              error: 'Error deleting review.',
            });
          } else {
            res.send({
              success: true,
              error: '',
            });
          }
        });
      }
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
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const userId = req.session.passport.user;
        // Ensure all fields are populated before leaving review
        if (!req.body.rating || !req.body.title || !req.body.content) {
          res.send({
            success: false,
            error: 'All fields must be populated.'
          });
        } else {
          // If user is logged in, first find author in MongoDB
          User.findById(userId, (errUser, user) => {
            // Error finding user
            if (errUser) {
              res.send({
                success: false,
                error: 'Error posting review.'
              });
            } else

            // If user doesn't exist
            if (!user) {
              res.send({
                success: false,
                error: 'User does not exist.'
              });
            } else {
              // If no errors can now save new reviews
              Listing.findById(req.body.listingId, (errListing, listing) => {
                // Error finding listing
                if (errListing) {
                  res.send({
                    success: false,
                    error: 'Error posting review.',
                  });
                } else

                // Listing doesn't exist for some reason
                if (!listing) {
                  res.send({
                    success: false,
                    error: 'Error posting review.',
                  });
                } else {
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
                      // TODO
                      res.send({
                        success: false,
                        error: 'Error posting review.',
                      });
                    } else {
                      // If already left a review send back error
                      if (leftReviewAlready) {
                        res.send({
                          success: false,
                          error: "Users may only leave one review."
                        });
                      } else {
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
                        listing.save((er) => {
                          // Error saving listing
                          if (er) {
                            res.send({
                              success: false,
                              error: 'Error saving review.',
                            });
                          } else {
                            // Finally, if review is saved successfully
                            res.send({
                              success: true,
                              error: '',
                            });
                          }
                        });
                      }
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  });

  return router;
};
