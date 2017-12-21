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
   * Route to get data from mongo when home page is loaded
   * This should pull articles, listings, and videos alike
   * TODO pull all data
   */
  router.get('/home', (req, res) => {
    // Pulls articles from mongo
    Article.find((err, articles) => {
      if (err) {
        console.log('error getting articles', err);
      }
      res.send(articles);
    });
    return true;
  });

  /**
   * Route to handle a new article submission
   * @param title
   * @param subtitle
   * @param image (url)
   * @param body (text of the article)
   */
  router.post('/articles/new', (req, res) => {
    // Creates a new article with given params
    const newArticle = new Article({
      title: req.body.title,
      subtitle: req.body.subtitle,
      image: req.body.image,
      body: req.body.body,
    });

    // Save the new article in Mongo
    newArticle.save((er, article) => {
      if (er) {
        console.log('error registering an article', er);
        res.send('Error saving article');
        return false;
      }
      console.log('successful article register', article);
      res.send('success');
      return true;
    });
  });

  /**
   * Route to handle pulling the information for a specific article
   * TODO better error checking
   */
  router.post('/articles/:articleId', (req, res) => {
    // Find the id from the url
    const id = req.body.articleId;

    // Pull specific article from mongo
    Article.findById(id, (err, article) => {
      if (err) console.log('e', err);
      res.send(article);
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
