// Import frameworks
const express = require('express');
const router = express.Router();

// Import models
const Article = require('./models/article');

module.exports = () => {
  // Route to get data from mongo when home page is loaded
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

  // Route to handle a new article submission
  router.post('/articles/new', (req, res) => {
    // Creates a new article with given params
    const newArticle = new Article({
      title: req.body.title,
      subtitle: req.body.subtitle,
      image: req.body.image,
      body: req.body.body,
    });
    // Saving new article in Mongo
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

  // Route to handle opening a specific article
  router.post('/articles/:articleId', (req, res) => {
    // Pull specific article from mongo
    Article.findById(req.body.articleId, (err, article) => {
      if (err) console.log('e', err);
      res.send(article);
    });
    return;
  });
  return router;
};
