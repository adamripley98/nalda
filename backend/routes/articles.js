/**
 * Handles all backend routes for articles
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const Article = require('../models/article');
const User = require('../models/user');

// Import helper methods
const {notCuratorOrAdmin} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Pull all articles from the database
   */
  router.get('/', (req, res) => {
    // Pulls articles from mongo
    Article.find((err, articles) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err.message,
        });
      } else {
        // Add a timestamp field for sorting
        articles.forEach((article) => {
          article.createdAt = article._id.getTimestamp();
        });

        // Send articles back in correct order
        articles.reverse();

        // Send back data
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
   */
  router.post('/new', (req, res) => {
    // Check to make sure poster is an admin or curator
    const authError = notCuratorOrAdmin(req);

    // Return any authentication errors
    if (authError) {
      res.send({
        success: false,
        error: authError,
      });
    } else {
      // Isolate variables
      const title = req.body.title;
      const subtitle = req.body.subtitle;
      const image = req.body.image;
      const body = req.body.body;
      const location = req.body.location;
      const userId = req.session.passport.user;

      // Keep track of any errors
      let error = "";
      const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

      // Perform error checking on variables
      if (!title) {
        error = "Title must be populated.";
      } else if (!subtitle) {
        error = "Subtitle must be populated.";
      } else if (!image) {
        error = "Image must be populated.";
      } else if (!body || !body.length) {
        error = "Body must be populated.";
      } else if (!urlRegexp.test(image)) {
        error = "Image must be a valid URL to an image.";
      } else if (typeof body !== "object" || !Array.isArray(body)) {
        error = "Body must be an array";
      } else if (Object.keys(location).length === 0) {
        error = "Location must be populated.";
      } else {
        // Ensure that each article component is properly formatted
        for (let i = 0; i < body.length && !error; i++) {
          // Find the component at the given index
          const component = body[i];
          if (!component) {
            error = "Each component must be defined.";
          } else if (!component.body) {
            error = "Each component must be populated with text.";
          } else if (component.componentType !== "text" &&
                     component.componentType !== "image" &&
                     component.componentType !== "quote"
          ) {
            error = "Component type must be valid.";
          } else if (component.componentType === "image") {
            // Ensure that the URL to the image is proper
            // This means that it is both a URL and an image file
            const imgRegexp = /\.(jpeg|jpg|gif|png)$/;
            if (!imgRegexp.test(component.body)) {
              error = "Image url must end in \"jpeg\", \"png\", \"gif\", or \"jpg\".";
            } else if (!urlRegexp.test(component.body)) {
              error = "Image url must be a valid URL.";
            }
          }
        }
      }
      // If there was an error or not
      if (error) {
        res.send({
          success: false,
          error,
        });
      } else {
        // Find the author
        User.findById(userId, (err, author) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error finding author ' + err.message
            });
          } else if (!author) {
            res.send({
              success: false,
              error: 'Author not found.'
            });
          } else {
            // Creates a new article with given params
            const newArticle = new Article({
              title,
              subtitle,
              image,
              body,
              location,
              author: userId,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });

            // Save the new article in Mongo
            newArticle.save((errArticle, article) => {
              if (errArticle) {
                // If there was an error saving the article
                res.send({
                  success: false,
                  error: errArticle.message,
                });
              } else {
                // Successfully send back data
                res.send({
                  success: true,
                  data: article,
                });
              }
            });
          }
        });
      }
    }
  });

  /**
   * Route to handle a editing an article
   * @param title
   * @param subtitle
   * @param image (url)
   * @param body (text of the article)
   */
  router.post('/:id/edit', (req, res) => {
    // Find the id from the url
    const articleId = req.params.id;

    // Check to make sure editor is an admin or curator
    const authError = notCuratorOrAdmin(req);

    // Return any authentication errors
    if (authError) {
      res.send({
        success: false,
        error: authError,
      });
    } else {
      // Isolate variables
      const title = req.body.title;
      const subtitle = req.body.subtitle;
      const image = req.body.image;
      const body = req.body.body;
      const location = req.body.location;
      const userId = req.session.passport.user;

      // Keep track of any errors
      let error = "";
      const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

      // Perform error checking on variables
      if (!title) {
        error = "Title must be populated.";
      } else if (!subtitle) {
        error = "Subtitle must be populated.";
      } else if (!image) {
        error = "Image must be populated.";
      } else if (!body || !body.length) {
        error = "Body must be populated.";
      } else if (!urlRegexp.test(image)) {
        error = "Image must be a valid URL to an image.";
      } else if (typeof body !== "object" || !Array.isArray(body)) {
        error = "Body must be an array";
      } else if (Object.keys(location).length === 0) {
        error = "Location must be populated.";
      } else {
        // Ensure that each article component is properly formatted
        for (let i = 0; i < body.length && !error; i++) {
          // Find the component at the given index
          const component = body[i];
          if (!component) {
            error = "Each component must be defined.";
          } else if (!component.body) {
            error = "Each component must be populated with text.";
          } else if (component.componentType !== "text" &&
                     component.componentType !== "image" &&
                     component.componentType !== "quote"
          ) {
            error = "Component type must be valid.";
          } else if (component.componentType === "image") {
            // Ensure that the URL to the image is proper
            // This means that it is both a URL and an image file
            const imgRegexp = /\.(jpeg|jpg|gif|png)$/;
            if (!imgRegexp.test(component.body)) {
              error = "Image url must end in \"jpeg\", \"png\", \"gif\", or \"jpg\".";
            } else if (!urlRegexp.test(component.body)) {
              error = "Image url must be a valid URL.";
            }
          }
        }
      }

      // If there was an error or not
      if (error) {
        res.send({
          success: false,
          error,
        });
      } else {
        // Find the author
        User.findById(userId, (err, author) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error finding author ' + err.message
            });
          } else if (!author) {
            res.send({
              success: false,
              error: 'Author not found.'
            });
          } else {
            // Find article in Mongo
            Article.findById(articleId, (articleErr, article) => {
              if (articleErr) {
                res.send({
                  success: false,
                  error: articleErr.message,
                });
              } else {
                // Make changes to given article
                article.title = title;
                article.subtitle = subtitle;
                article.image = image;
                article.body = body;
                article.location = location;
                article.author = userId;
                article.updatedAt = new Date().getTime();
                // Save changes in mongo
                article.save((errSave) => {
                  if (errSave) {
                    res.send({
                      success: false,
                      error: errSave.message,
                    });
                  } else {
                    res.send({
                      success: true,
                      error: '',
                      data: article,
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });

  /**
   * Route to handle pulling the information for a specific article
   */
  router.get('/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Check if user is logged in
    let userId = "";
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Pull specific article from mongo
    Article.findById(id, (err, article) => {
      if (err) {
        res.send({
          success: false,
          error: err.message,
        });
      // If the article doesn't exist
      } else if (!article) {
        res.send({
          success: false,
          error: "Article not found.",
        });

        // If no errors, returns article along with the date it was created
      } else {
        // Fetch author data
        User.findById(article.author, (er, author) => {
          if (er) {
            // Error finding author
            res.send({
              success: false,
              error: er.message,
            });
          } else if (!author) {
            res.send({
              success: false,
              error: 'Cannot find author.',
            });
          } else {
            // Default: users can't change article
            let canModify = false;
            User.findById(userId, (errUser, user) => {
              if (user) {
                // Check if given user is either an admin or the curator of the article
                if (user.userType === 'admin' || user._id === article.author) {
                  canModify = true;
                }
              }
              // Author found
              res.send({
                success: true,
                data: article,
                timestamp: article._id.getTimestamp(),
                author: {
                  name: author.name,
                  profilePicture: author.profilePicture,
                  _id: author._id,
                },
                canModify,
              });
            });
          }
        });
      }
    });
  });

  /**
   * Route to handle deleting a specific article
   */
  router.delete('/:id', (req, res) => {
    // Find the id from the article url
    const id = req.params.id;

    // Pull userId from the backend
    let userId = '';
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Find the given article in Mongo and delete it
    Article.findById(id, (errArticle, article) => {
      // Error finding article
      if (errArticle) {
        res.send({
          success: false,
          error: errArticle.message,
        });
      // Cannot find article
      } else if (!article) {
        res.send({
          success: false,
          error: 'No article found.',
        });
      } else {
        // Check to make sure user is logged in on backend
        if (!userId) {
          res.send({
            success: false,
            error: 'You must be logged in to delete articles.',
          });
        } else {
          // Find user to check if they can delete docs
          User.findById(userId, (errUser, user) => {
            // Error finding user
            if (errUser) {
              res.send({
                success: false,
                error: errUser.message,
              });
            // Cannot find user
            } else if (!user) {
              res.send({
                success: false,
                error: 'You must be logged in.'
              });
            } else {
              // User found, check if user has privileges to delete an article (author or admin)
              if (user.userType === 'admin' || user._id === article.author) {
                // User CAN delete articles, remove from mongo
                article.remove((errRemove) => {
                  if (errRemove) {
                    res.send({
                      success: false,
                      error: errRemove.message,
                    });
                  // Send back success
                  } else {
                    res.send({
                      success: true,
                      error: '',
                    });
                  }
                });
              } else {
                // User CANNOT delete articles
                res.send({
                  success: false,
                  error: 'You do not have privileges to delete articles.'
                });
              }
            }
          });
        }
      }
    });
  });

  return router;
};
