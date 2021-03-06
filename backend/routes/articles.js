/**
 * Handles all backend routes for articles
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');

// Import database models
const Article = require('../models/article');
const User = require('../models/user');
const Homepage = require('../models/homepage');

// Import helper methods
const {CuratorOrAdminCheck} = require('../helperMethods/authChecking');
const {ResizeAndUploadImage} = require('../helperMethods/imageProcessing');

// Export the following methods for routing
module.exports = () => {
  /**
   * Pull all articles from the database
   */
  router.get('/', (req, res) => {
    // Pulls articles from mongo
    Article.find((err, fullArticles) => {
      if (err) {
        // If there was an error with the request
        res.status(404).send({error: 'Error finding articles.'});
        return;
      }
      // Add a timestamp field for sorting
      fullArticles.forEach((article) => {
        article.createdAt = article._id.getTimestamp();
      });

      // Return only important information
      const articles = fullArticles.map(article => ({
        _id: article._id,
        title: article.title,
        subtitle: article.subtitle,
        image: article.image,
        imagePreview: article.imagePreview,
      }));

      // Send articles back in correct order
      articles.reverse();

      // Send back data
      res.send({articles});
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
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (authRes.error) {
        res.status(400).send({error: authRes.error});
        return;
      }
      // Isolate variables
      const userId = req.session.passport.user;
      const { title, subtitle, image, body, location } = req.body;

      // Keep track of any errors
      let error = "";

      // Perform error checking on variables
      if (!title) {
        error = "Title must be populated.";
      } else if (!subtitle) {
        error = "Subtitle must be populated.";
      } else if (!image) {
        error = "Image must be populated.";
      } else if (!body || !body.length) {
        error = "Body must be populated.";
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
                     component.componentType !== "quote" &&
                     component.componentType !== "header"
          ) {
            error = "Component type must be valid.";
          }
        }
      }
      // If there was an error or not
      if (error) {
        res.status(404).send({error});
        return;
      }

      // Find the author
      User.findById(userId)
        .then(author => {
        // Error check
          if (!author) {
            res.status(404).send({error: 'You must be an author.'});
            return;
          }
          // Resize main article image
          ResizeAndUploadImage(image, 'articlepictures', 1920, title, (resp1) => {
            if (resp1.error) {
              res.status(404).send({error: resp1.error});
              return;
            }
            // Resize preview article image
            ResizeAndUploadImage(image, 'articlepictures', 600, title, (resp2) => {
              if (resp2.error) {
                res.status(404).send({error: resp2.error});
                return;
              }
              // Resize all article images from body
              const newBody = [];
              async.eachSeries(body, (comp, cb) => {
                if (comp.componentType === 'image') {
                  ResizeAndUploadImage(comp.body, 'articlepictures', 1280, title, (resp3) => {
                    if (resp3.error) {
                      res.status(404).send({error: resp3.error});
                      return;
                    }
                    newBody.push({componentType: comp.componentType, body: resp3.resizedImg});
                    cb();
                  });
                } else {
                // If component is not an image, simply add it to body
                  newBody.push({componentType: comp.componentType, body: comp.body});
                  cb();
                }
              }, (asyncErr) => {
                if (asyncErr) {
                  res.status(404).send({error: 'Error posting article.'});
                  return;
                }
                // Creates a new article with given params
                const newArticle = new Article({
                  title,
                  subtitle,
                  image: resp1.resizedImg,
                  imagePreview: resp2.resizedImg,
                  body: newBody,
                  location,
                  author: userId,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                });
                // Save article
                newArticle.save()
                  .then(article => {
                    // Successfully send back data
                    res.send({article});
                    return;
                  })
                  .catch(() => {
                    res.status(404).send({error: 'Error posting article.'});
                    return;
                  });
              });
            });
          });
        });
    });
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
    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(400).send({error: authRes.error});
        return;
      }
      // Isolate variables
      const {title, subtitle, image, body, location} = req.body;
      const userId = req.session.passport.user;

      // Keep track of any errors
      let error = "";
      let articleImg = image;
      let articlePrevImg = image;

      // Perform error checking on variables
      if (!title) {
        error = "Title must be populated.";
      } else if (!subtitle) {
        error = "Subtitle must be populated.";
      } else if (!image) {
        error = "Image must be populated.";
      } else if (!body || !body.length) {
        error = "Body must be populated.";
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
                     component.componentType !== "quote" &&
                     component.componentType !== "header"
          ) {
            error = "Component type must be valid.";
          } else if (component.componentType === "image") {
            // TODO error check for proper type
          }
        }
      }

      // If there was an error or not
      if (error) {
        res.status(400).send({error});
        return;
      }

      // If initial image is new, upload to s3
      const awaitMainImageUpload = new Promise(resolve => {
        if (image.indexOf('s3.amazonaws') === -1) {
          ResizeAndUploadImage(image, 'articlepictures', 1920, title, (resp1) => {
            if (resp1.error) {
              resolve(res.status(404).send({error: resp1.error}));
              return;
            }
            // Make a preview version for performance
            ResizeAndUploadImage(image, 'articlepictures', 600, title, (resp2) => {
              if (resp2.error) {
                resolve(res.status(404).send({error: resp2.error}));
                return;
              }
              // For scope reasons
              articleImg = resp1.resizedImg;
              articlePrevImg = resp2.resizedImg;
              resolve();
            });
          });
        } else {
          resolve();
        }
      });
      // After initial image is dealed with, check if other images need to be uploaded
      awaitMainImageUpload.then(() => {
        // Loop through images
        const newBody = [];
        async.eachSeries(body, (comp, cb) => {
          // Check if given component is an image and hasn't been uploaded to s3
          if (comp.componentType === 'image') {
            if (comp.body.indexOf('s3.amazonaws') === -1) {
              ResizeAndUploadImage(comp.body, 'articlepictures', 600, title, (resp3) => {
                if (resp3.error) {
                  res.status(404).send({error: resp3.error});
                  return;
                }
                newBody.push({componentType: comp.componentType, body: resp3.resizedImg});
                cb();
              });
            } else {
              // Image has already been uploaded
              newBody.push({componentType: comp.componentType, body: comp.body});
              cb();
            }
          } else {
            // Body component is not an image
            newBody.push({componentType: comp.componentType, body: comp.body});
            cb();
          }
        }, (asyncErr) => {
          if (asyncErr) {
            res.status(404).send({error: 'Error editting article'});
            return;
          }
          // Find the author
          User.findById(userId)
            .then(author => {
              if (!author) {
                res.status(404).send({error: 'Error editting article'});
                return;
              }
              // Find article in Mongo
              Article.findById(articleId, (articleErr, article) => {
                if (articleErr) {
                  res.status(404).send({error: 'Error editting article'});
                  return;
                }
                // Make changes to given article
                article.title = title;
                article.subtitle = subtitle;
                article.image = articleImg;
                article.imagePreview = articlePrevImg;
                article.body = newBody;
                article.location = location;
                article.author = userId;
                article.updatedAt = new Date().getTime();
                // Save changes in mongo
                article.save()
                  .then(() => {
                    // Success
                    res.send({article});
                  })
                  .catch(() => {
                    res.status(404).send({error: 'Error editting article'});
                    return;
                  });
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error finding author'});
              return;
            });
        });
      })
        .catch(() => {
          res.status(404).send({error: 'Error editting author'});
          return;
        });
    });
  });

  /**
   * Route to handle pulling the information for a specific article
   */
  router.get('/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Pull specific article from mongo
    Article.findById(id)
      .then(article => {
        if (!article) {
          res.status(404).send({error: "Article not found."});
          return;
        }
        // Fetch author data
        User.findById(article.author)
          .then(author => {
            if (!author) {
              res.status(404).send({error: "Article not found."});
              return;
            }
            // Default: users can't change article
            let canModify = false;
            // Check to see if user is logged in, admin/curator
            User.findById(req.session.passport ? req.session.passport.user : null)
              .then(user => {
                if (user) {
                  // Check if given user is either an admin or the curator of the article
                  if (user.userType === 'admin' || user.userType === 'curator') {
                    canModify = true;
                  }
                }
                res.send({
                  article,
                  author: {
                    name: author.name,
                    profilePicture: author.profilePicture,
                    _id: author._id,
                  },
                  canModify,
                });
              })
              .catch(() => {
                res.status(404).send({error: "Article not found."});
                return;
              });
          })
          .catch(() => {
            res.status(404).send({error: "Article not found."});
            return;
          });
      })
      .catch(() => {
        res.status(404).send({error: "Article not found."});
        return;
      });
  });

  /**
   * Route to handle deleting a specific article
   */
  router.delete('/:id', (req, res) => {
    // Find the id from the article url
    const articleId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Find given article
      Article.findById(articleId)
        .then(article => {
        // User CAN delete articles, remove from mongo
          article.remove()
            .then(() => {
              // Remove it from homepage
              Homepage.find({})
                .then((homepage) => {
                  const home = homepage[0];
                  const banner = home.banner.slice();
                  // Remove content from banner
                  for (var j = 0; j < banner.length; j++) {
                    if (banner[j].contentId === articleId) {
                      banner.splice(j, 1);
                      break;
                    }
                  }
                  // Delete component from homepage
                  const components = home.components.slice();
                  components.forEach((comp, i) => {
                    comp.content.forEach((content, k) => {
                      if (content.contentId === articleId) {
                        components[i].content.splice(k, 1);
                      }
                    });
                  });
                  // Save changes
                  home.banner = banner;
                  home.components = components;

                  // Save in mongo
                  home.save()
                    .then(() => {
                      // On success, return
                      res.send({error: ''});
                      return;
                    })
                    .catch(() => {
                      res.status(400).send({error: 'Cannot delete article.'});
                      return;
                    });
                })
                .catch(() => {
                  res.status(400).send({error: 'Cannot delete article.'});
                  return;
                });
            })
            .catch(() => {
              res.status(400).send({error: 'Cannot delete article.'});
              return;
            });
        })
        .catch(() => {
          res.status(400).send({error: 'Cannot delete article.'});
          return;
        });
    });
  });

  return router;
};
