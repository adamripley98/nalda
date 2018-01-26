/**
 * Handles all backend routes for reviews
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const Listing = require('../models/listing');
const User = require('../models/user');

// Import helper methods
const {notLoggedIn} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
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
    const authError = notLoggedIn(req);

    // Return any authentication errors
    if (authError) {
      res.send({
        success: false,
        error: authError,
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
              error: 'Error finding user' + errUser.message,
            });
          } else

          // If user doesn't exist
          if (!user) {
            res.send({
              success: false,
              error: 'User does not exist.'
            });
          } else {
            // TODO Will eventually also want to store reviews in user model
            // If no errors can now save new reviews
            // First find given listing
            Listing.findById(req.body.listingId, (errListing, listing) => {
              // Error finding listing
              if (errListing) {
                res.send({
                  success: false,
                  error: errListing.message,
                });
              } else

              // Listing doesn't exist for some reason
              if (!listing) {
                res.send({
                  success: false,
                  error: 'Cannot find listing.',
                });
              } else {
                // If listing has been found, update it with review
                const currentReviews = listing.reviews;

                // Check if user has already left a review
                let leftReviewAlready = false;
                currentReviews.forEach((review) => {
                  if (review.authorId === user._id) {
                    leftReviewAlready = true;
                  }
                });

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
                        error: 'Error saving review' + er.message,
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
    }
  });

  return router;
};
