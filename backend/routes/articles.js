/**
 * Handles all backend routes for articles
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const uuid = require('uuid-v4');
const async = require('async');
const sharp = require('sharp');

// Import database models
const Article = require('../models/article');
const User = require('../models/user');
const Homepage = require('../models/homepage');

// Import helper methods
const {CuratorOrAdminCheck} = require('../helperMethods/authChecking');

// Isolate environmental variables
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_USER_KEY = process.env.AWS_USER_KEY;
const AWS_USER_SECRET = process.env.AWS_USER_SECRET;

// Set up bucket
const s3bucket = new AWS.S3({
  accessKeyId: AWS_USER_KEY,
  secretAccessKey: AWS_USER_SECRET,
  Bucket: AWS_BUCKET_NAME,
});

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
          error: 'Error finding articles.',
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
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (authRes.error) {
        res.send({
          success: false,
          error: authRes.error,
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
              // TODO Error check to ensure pictures are valid form
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
                error: 'Error finding author.',
              });
            } else if (!author) {
              res.send({
                success: false,
                error: 'Author not found.'
              });
            } else {
              // Convert article picture to a form that s3 can display
              const imageConverted = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
              const folderId = uuid();

              // Resize to be appropriate size
              sharp(imageConverted)
              .resize(1920, null)
              .toBuffer()
              .then( resized => {
                // Create bucket
                s3bucket.createBucket(() => {
                  var params = {
                    Bucket: AWS_BUCKET_NAME,
                    Key: `articlepictures/${folderId}/${uuid()}`,
                    ContentType: 'image/jpeg',
                    Body: resized,
                    ContentEncoding: 'base64',
                    ACL: 'public-read',
                  };
                  // Upload photo
                  s3bucket.upload(params, (errUpload, data) => {
                    if (errUpload) {
                      res.send({
                        success: false,
                        error: 'Error uploading profile picture.',
                      });
                    } else {
                      // Resize to be appropriate size
                      sharp(imageConverted)
                      .resize(600, null)
                      .toBuffer()
                      .then( resizedPrev => {
                        s3bucket.createBucket(() => {
                          var previewParams = {
                            Bucket: AWS_BUCKET_NAME,
                            Key: `articlepictures/${folderId}/${uuid()}`,
                            ContentType: 'image/jpeg',
                            Body: resizedPrev,
                            ContentEncoding: 'base64',
                            ACL: 'public-read',
                          };
                          // Upload photo
                          s3bucket.upload(previewParams, (errorUpload, previewData) => {
                            if (errorUpload) {
                              res.send({
                                success: false,
                                error: 'Error uploading profile picture.',
                              });
                            } else {
                              const newBody = [];
                              async.eachSeries(body, (comp, cb) => {
                                if (comp.componentType === 'image') {
                                  const articlePictureConverted = new Buffer(comp.body.replace(/^data:image\/\w+;base64,/, ""), 'base64');

                                  // Resize to be appropriate size
                                  sharp(articlePictureConverted)
                                  .resize(1280, null)
                                  .toBuffer()
                                  .then( resizedArticlePic => {
                                    s3bucket.createBucket(() => {
                                      var parameters = {
                                        Bucket: AWS_BUCKET_NAME,
                                        Key: `articlepictures/${folderId}/${uuid()}`,
                                        ContentType: 'image/jpeg',
                                        Body: resizedArticlePic,
                                        ContentEncoding: 'base64',
                                        ACL: 'public-read',
                                      };
                                      // Upload photo
                                      s3bucket.upload(parameters, (errorupload, img) => {
                                        if (errorupload) {
                                          res.send({
                                            success: false,
                                            error: 'Error uploading profile picture.',
                                          });
                                        } else {
                                          newBody.push({componentType: comp.componentType, body: img.Location});
                                          cb();
                                        }
                                      });
                                    });
                                  });
                                } else {
                                  // If component is not an image, simply add it to body
                                  newBody.push({componentType: comp.componentType, body: comp.body});
                                  cb();
                                }
                              }, (asyncErr) => {
                                if (asyncErr) {
                                  res.send({
                                    success: false,
                                    error: 'Error posting article.',
                                  });
                                } else {
                                  // Creates a new article with given params
                                  const newArticle = new Article({
                                    title,
                                    subtitle,
                                    image: data.Location,
                                    imagePreview: previewData.Location,
                                    body: newBody,
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
                                        error: 'Error posting article.',
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
                          });
                        });
                      });
                    }
                  });
                });
              })
              .catch(() => {
                res.send({
                  success: false,
                  error: 'Error uploading image.',
                });
              });
            }
          });
        }
      }
    });
  });

  /**
   * Route to handle a editing an article
   * @param title
   * @param subtitle
   * @param image (url)
   * @param body (text of the article)
   */
   // TODO find better way to implement without reusing entire code block
  router.post('/:id/edit', (req, res) => {
    // Find the id from the url
    const articleId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
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
        // const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

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
              // Ensure that the URL to the image is proper
              // This means that it is both a URL and an image file
              // const imgRegexp = /\.(jpeg|jpg|gif|png)$/;
              // if (!imgRegexp.test(component.body)) {
              //   error = "Image url must end in \"jpeg\", \"png\", \"gif\", or \"jpg\".";
              // }
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
          // Update image
          if (image.indexOf('naldacampus.s3.amazonaws') === -1) {
            // Convert article picture to a form that s3 can display
            const imageConverted = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            const folderId = uuid();

            // Resize to be appropriate size
            sharp(imageConverted)
            .resize(1920, null)
            .toBuffer()
            .then( resizedImage => {
              // Create bucket
              s3bucket.createBucket(() => {
                var params = {
                  Bucket: AWS_BUCKET_NAME,
                  Key: `articlepictures/${folderId}/${uuid()}`,
                  ContentType: 'image/jpeg',
                  Body: resizedImage,
                  ContentEncoding: 'base64',
                  ACL: 'public-read',
                };
                // Upload photo
                s3bucket.upload(params, (errUpload, data) => {
                  if (errUpload) {
                    res.send({
                      success: false,
                      error: 'Error uploading profile picture.',
                    });
                  } else {
                    // Resize to be appropriate size
                    sharp(imageConverted)
                    .resize(600, null)
                    .toBuffer()
                    .then( resizedPreviewImage => {
                      s3bucket.createBucket(() => {
                        var previewParams = {
                          Bucket: AWS_BUCKET_NAME,
                          Key: `articlepictures/${folderId}/${uuid()}`,
                          ContentType: 'image/jpeg',
                          Body: resizedPreviewImage,
                          ContentEncoding: 'base64',
                          ACL: 'public-read',
                        };
                        // Upload photo
                        s3bucket.upload(previewParams, (errorUpload, previewData) => {
                          if (errorUpload) {
                            res.send({
                              success: false,
                              error: 'Error uploading profile picture.',
                            });
                          } else {
                            const newBody = [];
                            async.eachSeries(body, (comp, cb) => {
                              if (comp.componentType === 'image') {
                                if (comp.body.indexOf('naldacampus') === -1) {
                                  const articlePictureConverted = new Buffer(comp.body.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                                  // Resize to be appropriate size
                                  sharp(articlePictureConverted)
                                  .resize(600, null)
                                  .toBuffer()
                                  .then( resizedArticleImage => {
                                    s3bucket.createBucket(() => {
                                      var parameters = {
                                        Bucket: AWS_BUCKET_NAME,
                                        Key: `articlepictures/${folderId}/${uuid()}`,
                                        ContentType: 'image/jpeg',
                                        Body: resizedArticleImage,
                                        ContentEncoding: 'base64',
                                        ACL: 'public-read',
                                      };
                                      // Upload photo
                                      s3bucket.upload(parameters, (errorupload, img) => {
                                        if (errorupload) {
                                          res.send({
                                            success: false,
                                            error: 'Error uploading profile picture.',
                                          });
                                        } else {
                                          newBody.push({componentType: comp.componentType, body: img.Location});
                                          cb();
                                        }
                                      });
                                    });
                                  });
                                } else {
                                  newBody.push({componentType: comp.componentType, body: comp.body});
                                  cb();
                                }
                              } else {
                                // If component is not an image, simply add it to body
                                newBody.push({componentType: comp.componentType, body: comp.body});
                                cb();
                              }
                            }, (asyncErr) => {
                              if (asyncErr) {
                                res.send({
                                  success: false,
                                  error: 'Error posting article.',
                                });
                              } else {
                                // Find the author
                                User.findById(userId, (err, author) => {
                                  if (err) {
                                    res.send({
                                      success: false,
                                      error: 'Error finding author.',
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
                                          error: 'Error editing article.',
                                        });
                                      } else {
                                        // Make changes to given article
                                        article.title = title;
                                        article.subtitle = subtitle;
                                        article.image = data.Location;
                                        article.previewImage = previewData.Location;
                                        article.body = newBody;
                                        article.location = location;
                                        article.author = userId;
                                        article.updatedAt = new Date().getTime();
                                        // Save changes in mongo
                                        article.save((errSave) => {
                                          if (errSave) {
                                            res.send({
                                              success: false,
                                              error: 'Error editting article.',
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
                            });
                          }
                        });
                      });
                    });
                  }
                });
              });
            });
          } else {
            // Don't update image because it is already stored in s3
            const folderId = uuid();
            const newBody = [];
            async.eachSeries(body, (comp, cb) => {
              if (comp.componentType === 'image') {
                // Need to story body image in aws
                if (comp.body.indexOf('naldacampus.s3.amazonaws') === -1) {
                  const articlePictureConverted = new Buffer(comp.body.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                  sharp(articlePictureConverted)
                  .resize(600, null)
                  .toBuffer()
                  .then( resizedArticleImage => {
                    s3bucket.createBucket(() => {
                      var parameters = {
                        Bucket: AWS_BUCKET_NAME,
                        Key: `articlepictures/${folderId}/${uuid()}`,
                        ContentType: 'image/jpeg',
                        Body: resizedArticleImage,
                        ContentEncoding: 'base64',
                        ACL: 'public-read',
                      };
                      // Upload photo
                      s3bucket.upload(parameters, (errorUpload, img) => {
                        if (errorUpload) {
                          res.send({
                            success: false,
                            error: 'Error uploading profile picture.',
                          });
                        } else {
                          newBody.push({componentType: comp.componentType, body: img.Location});
                          cb();
                        }
                      });
                    });
                  });
                } else {
                  // body image is already stored in aws
                  newBody.push({componentType: comp.componentType, body: comp.body});
                  cb();
                }
              } else {
                // If component is not an image, simply add it to body
                newBody.push({componentType: comp.componentType, body: comp.body});
                cb();
              }
            }, (asyncErr) => {
              if (asyncErr) {
                res.send({
                  success: false,
                  error: 'Error posting article.',
                });
              } else {
                // Find the author
                User.findById(userId, (err, author) => {
                  if (err) {
                    res.send({
                      success: false,
                      error: 'Error finding author.',
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
                          error: 'Error posting article.',
                        });
                      } else {
                        // Make changes to given article
                        article.title = title;
                        article.subtitle = subtitle;
                        article.image = image;
                        article.body = newBody;
                        article.location = location;
                        article.author = userId;
                        article.updatedAt = new Date().getTime();
                        // Save changes in mongo
                        article.save((errSave) => {
                          if (errSave) {
                            res.send({
                              success: false,
                              error: 'Error posting article.',
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
            });
          }
        }
      }
    });
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
        res.status(404).send({
          success: false,
          error: "Article not found.",
        });
      // If the article doesn't exist
      } else if (!article) {
        res.status(404).send({
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
              error: "Article not found.",
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
                if (user.userType === 'admin' || user.userType === 'curator') {
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
    const articleId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // User CAN delete articles, remove from mongo
        authRes.doc.remove((errRemove) => {
          if (errRemove) {
            res.send({
              success: false,
              error: "Error deleting article.",
            });
          // Send back success
          } else {
            Homepage.find({}, (errHome, homepage) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: 'Error deleting article.',
                });
              } else {
                const home = homepage[0];
                const fromTheEditors = home.fromTheEditors;
                const banner = home.banner;
                // Delete listing from homepage
                for (var i = 0; i < fromTheEditors.length; i++) {
                  if (fromTheEditors[i].contentId === articleId) {
                    fromTheEditors.splice(i, 1);
                    break;
                  }
                }
                for (var j = 0; j < banner.length; j++) {
                  if (banner[j].contentId === articleId) {
                    banner.splice(j, 1);
                    break;
                  }
                }
                home.save((errSave) => {
                  if (errSave) {
                    res.send({
                      success: false,
                      error: 'Error deleting article.',
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
          }
        });
      }
    });
  });

  return router;
};
