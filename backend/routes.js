/**
 * Handles all backend routes
 * NOTE all of these routes are prefixed with "/api"
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const Article = require('./models/article');
const Listing = require('./models/listing');
const Video = require('./models/video');
const User = require('./models/user');

// Export the following methods for routing
module.exports = () => {
  /**
   * Route to signify that the API is working
   */
  router.get('/', (req, res) => {
    res.send({
      success: true,
      data: "API is up and running.",
    });
  });

  /**
   * Route to handle adding new admins, admins allowed to add more admins/curators and create content
   * @param userToAdd
   */
  router.post('/admin/new', (req, res) => {
    // finds given user in Mongo
    User.findOne({username: req.body.userToAdd}, (err, user) => {
      // Lets them know that if there is an error
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // Makes sure that user exists
      } else if (!user) {
        res.send({
          success: false,
          error: req.body.userToAdd + 'does not seem to exist!'
        });
      } else {
        // Makes given user an admin
        user.userType = "admin";
        user.save((err2) => {
          if (err2) {
            res.send({
              success: false,
              error: err2,
            });
          }
          // If no error saving new user, returns successfully
          res.send({
            success: true,
          });
        });
      }
    });
  });

  /**
   * Route to handle adding new curators, allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/new', (req, res) => {
    // finds given user in Mongo
    User.findOne({username: req.body.userToAdd}, (err, user) => {
      // Lets them know that if there is an error
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // Makes sure that user exists
      } else if (!user) {
        res.send({
          success: false,
          error: req.body.userToAdd + ' does not seem to exist!'
        });
      } else {
        // Makes given user an admin
        user.userType = "curator";
        user.save((err2) => {
          if (err2) {
            res.send({
              success: false,
              error: err2,
            });
          }
          // If no error saving new user, returns successfully
          res.send({
            success: true,
          });
        });
      }
    });
  });

  /**
   * Pull all videos from the database
   */
  router.get('/videos', (req, res) => {
    // Pulls videos from mongo
    Video.find((err, videos) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If everything went as planned
        res.send({
          success: true,
          data: videos,
        });
      }
    });
  });

  /**
   * Pull all listings from the database
   */
  router.get('/listings', (req, res) => {
    // Pulls articles from mongo
    Listing.find((err, listings) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If everything went as planned
        res.send({
          success: true,
          data: listings,
        });
      }
    });
  });

  /**
   * Pull all articles from the database
   */
  router.get('/articles', (req, res) => {
    // Pulls articles from mongo
    Article.find((err, articles) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If everything went as planned
        res.send({
          success: true,
          data: articles,
        });
      }
    });
  });

  /**
   * Route to receive user's information from Mongo
   * @param userID
   */
  router.get('/account', (req, res) => {
    User.findById(req.query.userId, (err, user) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
        // If no user exists
      } else if (!user) {
        res.send({
          success: false,
          error: 'Can not find user',
        });
      } else {
        // If everything went as planned, send back user
        res.send({
          success: true,
          data: user,
        });
      }
    });
  });

  /**
   * Route to handle a new article submission
   * @param title
   * @param subtitle
   * @param image (url)
   * @param body (text of the article)
   * TODO error checking
   */
  router.post('/articles/new', (req, res) => {
    // Isolate variables
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const image = req.body.image;
    const body = req.body.body;
    let error = "";
    const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    // Perform error checking on variables
    if (!title) {
      error = "Title must be populated.";
    } else if (!subtitle) {
      error = "Subtitle must be populated.";
    } else if (!image) {
      error = "Image must be populated.";
    } else if (!body) {
      error = "Body must be populated.";
    } else if (!urlRegexp.test(image)) {
      error = "Image must be a valid URL to an image.";
    }

    // If there was an error or not
    if (error) {
      res.send({
        success: false,
        error,
      });
    } else {
      // Creates a new article with given params
      const newArticle = new Article({
        title,
        subtitle,
        image,
        body,
      });

      // Save the new article in Mongo
      newArticle.save((err, article) => {
        if (err) {
          // If there was an error saving the article
          res.send({
            success: false,
            error: err,
          });
        } else {
          res.send({
            success: true,
            data: article,
          });
        }
      });
    }
  });

  /**
   * Route to handle pulling the information for a specific article
   */
  router.get('/articles/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Pull specific article from mongo
    Article.findById(id, (err, article) => {
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // If the article doesn't exist
      } else if (!article) {
        res.send({
          success: false,
          error: "Article not found",
        });
        // if no errors, returns article along with the date it was created
      } else {
        res.send({
          success: true,
          data: article,
          timestamp: article._id.getTimestamp(),
        });
      }
    });
  });

  /**
   * Route to handle pulling the information for a specific listing
   */
  router.get('/listings/:id', (req, res) => {
    // Find the id from the listing url
    const id = req.params.id;

    // Pull specific listing from mongo
    Listing.findById(id, (err, listing) => {
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // If the listing doesn't exist
      } else if (!listing) {
        res.send({
          success: false,
          error: "Article not found",
        });
      // if no errors, returns article along with the date it was created
      } else {
        res.send({
          success: true,
          data: listing,
          timestamp: listing._id.getTimestamp(),
        });
      }
    });
  });

/**
 * Route to handle creating new listings
 * @param title
 * @param description
   * @param image
   * @param hours
   * @param rating (0.5 increments from 0 to 5)
   * @param price
   * @param website
   */
  router.post('/listings/new', (req, res) => {
    // Isolate variables from the body
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const hours = req.body.hours;
    const rating = req.body.rating;
    const price = req.body.price;
    const website = req.body.website;
    let error = "";

    // Error checking
    // TODO: error check for hours
    if (!title) {
      error = "Title must be populated.";
    } else if (!description) {
      error = "Description must be populated.";
    } else if (!image) {
      error = "Image must be populated.";
    } else if (!rating) {
      error = "Rating must be populated.";
    } else if (!price) {
      error = "Price must be populated.";
    } else if (!website) {
      error = "Website must be populated.";
    }

    // Handle error if there is one
    if (error) {
      res.send({
        success: false,
        error,
      });
    } else {
      // Creates a new listing with given params
      const newListing = new Listing({
        title,
        description,
        image,
        hours,
        rating,
        price,
        website,
      });

      // Save the new article in mongo
      newListing.save((er, listing) => {
        if (er) {
          // Pass on any error to the user
          res.send({
            success: false,
            error: er,
          });
        } else {
          // Send the data along if it was successfully stored
          res.send({
            success: true,
            data: listing,
          });
        }
      });
    }
  });

  // Return the router for use throughout the application
  return router;
};
