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
      } else if (!article) {
        res.send({
          success: false,
          error: "Article not found",
        });
      } else {
        res.send({
          success: true,
          data: article,
        });
      }
    });
  });

  /**
   * Route to handle creating new listings
   * @param title
   * @param description
   * @param image
   * @param hours (TODO update the structure for this)
   * @param rating (0.5 increments from 0 to 5)
   * @param price
   */
  router.post('/listings/new', (req, res) => {
    // Creates a new listing with given params
    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      hours: req.body.hours,
      rating: req.body.rating,
      price: req.body.price,
    });

    // Save the new article in mongo
    newListing.save((er, listing) => {
      if (er) {
        console.log('error registering an listing', er);
        res.send('Error saving listing');
        return false;
      }
      console.log('successful listing register', listing);
      res.send('success');
      return true;
    });
  });

  // Return the router for use throughout the application
  return router;
};
