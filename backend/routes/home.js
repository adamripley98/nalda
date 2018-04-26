/**
 * Handles all backend routes for homepage
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
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');
const HomeComponent = require('../models/homeComponent');

// Import helper methods
const {AdminCheck} = require('../helperMethods/authChecking');

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
  // Helper function to pull data for each of the different content types
  const pullData = (components, callback) => {
    // Array of content to be returned
    const returnComponents = [];
    // Loop through array and pull pertinent data
    async.eachSeries(components, (component, cb) => {
      // Find the model for pulling data based on the content type
      let Model = null;
      if (component.contentType === 'Articles') {
        Model = Article;
      } else if (component.contentType === 'Listings') {
        Model = Listing;
      } else if (component.contentType === 'Videos') {
        Model = Video;
      } else return;

      // Find all of the content associated with the component
      if (component.content && component.content.length) {
        const returnContent = [];
        async.forEach(component.content, (cont, contentCallback) => {
          Model.findById(cont.contentId, (errContent, content) => {
            if (errContent) {
              callback({
                success: false,
                error: 'Error fetching homepage content',
              });
            } else if (content) {
              let newContent = {};
              if (component.contentType === 'Articles') {
                newContent = {
                  contentType: component.contentType,
                  contentId: cont.contentId,
                  title: content.title,
                  subtitle: content.subtitle,
                  image: content.image,
                  createdAt: content.createdAt,
                  updatedAt: content.updatedAt,
                  location: content.location,
                };
              } else if (component.contentType === 'Listings') {
                newContent = {
                  contentType: component.contentType,
                  contentId: cont.contentId,
                  title: content.title,
                  description: content.description,
                  location: content.location,
                  image: content.image,
                  rating: content.rating,
                  price: content.price,
                  categories: content.categories,
                };
              } else {
                // Content is a video
                newContent = {
                  contentType: component.contentType,
                  contentId: cont.contentId,
                  title: content.title,
                  description: content.description,
                  url: content.url,
                  location: content.location,
                  createdAt: content.createdAt,
                  updatedAt: content.updatedAt,
                };
              }
              returnContent.push(newContent);
              contentCallback();
            } else {
              contentCallback();
            }
          });
        }, contentAsyncErr => {
          if (contentAsyncErr) {
            cb();
          } else {
            component.content = returnContent;
            returnComponents.push(component);
            cb();
          }
        });
      } else {
        cb();
      }
    }, (asyncErr) => {
      if (asyncErr) {
        callback({
          success: false,
          error: 'Error loading homepage.'
        });
        return;
      }
      callback({
        success: true,
        error: '',
        returnComponents,
      });
    });
  };

  /**
   * Get content for the homepage
   */
  router.get('/', (req, res) => {
    Homepage.find({}, (errHome, home) => {
      if (errHome) {
        res.send({
          success: false,
          error: 'Cannot return homepage.',
        });
        return;
      }

      const homepage = home[0];
      if (homepage.components && homepage.components.length) {
        pullData(homepage.components, (resp) => {
          if (!resp.success) {
            res.send({
              success: false,
              error: resp.error,
            });
          } else {
            if (resp.returnComponents && resp.returnComponents.length) {
              res.send({
                success: true,
                error: '',
                banner: homepage.banner,
                components: resp.returnComponents,
              });
              return;
            }

            res.send({
              success: true,
              error: '',
              banner: homepage.banner,
              components: [],
            });
          }
        });
      } else {
        res.send({
          success: true,
          error: '',
          banner: homepage.banner,
          components: [],
        });
      }
    });
  });

  // Route to handle adding content to homepage banner
  router.post('/banner/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate body params
        const contentId = req.body.bannerContentId;
        const contentImage = req.body.bannerImageToAdd;
        // Attempt to find content in listing or article
        Listing.findById(contentId, (errListing, listing) => {
          Article.findById(contentId, (errArticle, article) => {
            // Pass back errors
            if (errListing || errArticle) {
              res.send({
                success: false,
                error: 'Error finding content.',
              });
              // Make sure id is of right format
            } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
              res.send({
                success: false,
                error: 'No content with that id exists.'
              });
              // Make sure content with given id exists
            } else if (!article && !listing) {
              res.send({
                success: false,
                error: 'No article or listing with that ID exists.',
              });
            } else {
              // Convert article picture to a form that s3 can display
              const imageConverted = new Buffer(contentImage.replace(/^data:image\/\w+;base64,/, ""), 'base64');

              // Resize to be appropriate size
              sharp(imageConverted)
              .resize(1920, null)
              .toBuffer()
              .then( resized => {
                // Create bucket
                s3bucket.createBucket(() => {
                  var params = {
                    Bucket: AWS_BUCKET_NAME,
                    Key: `bannerpictures/${uuid()}`,
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
                      // Find homepage
                      Homepage.find({}, (errHomepage, home) => {
                        if (errHomepage) {
                          res.send({
                            success: false,
                            error: 'Error finding homepage.',
                          });
                        // NOTE this is only to declare a homepage in the database for the first time
                        } else if (!home.length) {
                          // Create new homepage
                          const newHomepage = new Homepage({
                            banner: [],
                            naldaVideos: [],
                            categories: [],
                            recommended: [],
                            fromTheEditors: [],
                          });
                          // save new homepage in mongo
                          newHomepage.save((err) => {
                            if (err) {
                              res.send({
                                success: false,
                                error: 'Error on homepage.',
                              });
                            } else {
                              res.send({
                                success: false,
                                error: 'You just created the first instance of a homepage, try adding a banner again.',
                              });
                            }
                          });
                        } else {
                          const homepage = home[0];
                          const banner = homepage.banner.slice();
                          // Error check for duplicate content in banner
                          let duplicate = false;
                          banner.forEach((item) => {
                            if (item.contentId === contentId) {
                              duplicate = true;
                            }
                          });
                          if (duplicate) {
                            res.send({
                              success: false,
                              error: 'This content is already in the banner.',
                            });
                          } else {
                            // Create object to pass back, of type article or listing
                            const newBannerContent = {
                              contentType: article ? "article" : "listing",
                              contentId,
                              contentImage: data.Location,
                            };
                            // Add to banner
                            banner.push(newBannerContent);
                            homepage.banner = banner;
                            // Save new banner to mongo
                            homepage.save((errSave) => {
                              if (errSave) {
                                res.send({
                                  success: false,
                                  error: 'Error saving image.',
                                });
                              } else {
                                // Send back success
                                res.send({
                                  success: true,
                                  error: '',
                                  data: homepage.banner,
                                });
                              }
                            });
                          }
                        }
                      });
                    }
                  });
                });
              })
              .catch(() => {
                res.send({
                  success: false,
                  error: 'Image upload error.',
                });
              });
            }
          });
        });
      }
    });
  });

  // Route to handle deleting an item from the banner
  router.post('/banner/remove/:bannerContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.bannerContentId;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        Homepage.find({}, (err, home) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error retrieving homepage data.',
            });
          } else {
            const homepage = home[0];
            const banner = homepage.banner.slice();
            // Loop through to delete specific item
            banner.forEach((item) => {
              if (item.contentId === contentId) {
                banner.splice(banner.indexOf(item), 1);
                return;
              }
            });
            homepage.banner = banner;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: 'Error remvoing content.',
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.banner,
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to add a new component to the homepage
  router.post('/component/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
        return;
      }

      const { title, subtitle, contentType } = req.body;
      if (!title || !subtitle || !contentType) {
        res.send({
          success: false,
          error: 'Form must be filled out completely.',
        });
        return;
      }

      // Declare new home component with no content
      const newHomeComponent = new HomeComponent({
        title,
        subtitle,
        contentType,
        content: [],
      });
      // Save in mongo
      newHomeComponent.save((err, component) => {
        if (err) {
          res.send({
            success: false,
            error: 'Error adding component.',
          });
          return;
        }

        const newComp = {
          title,
          subtitle,
          contentType,
          content: [],
        };

        // Find the homepage to add the content to
        Homepage.find({}, (errHome, home) => {
          if (errHome) {
            res.send({
              success: false,
              error: 'Failed to save to homepage',
            });
            return;
          }

          // Select the first homepage
          const homepage = home[0];

          // Add this component to the homepage components
          const components = homepage.components.slice();
          components.push(newComp);
          homepage.components = components;

          // Save the new components to the homepage
          homepage.save((errSave, newHomepage) => {
            if (errSave) {
              res.send({
                success: false,
                error: 'Error adding component.',
              });
              return;
            }

            res.send({
              newHomepage,
              homepage,
              success: true,
              data: component,
            });
          });
        });
      });
    });
  });

  // Route to delete a given component from homepage
  router.post('/component/remove', (req, res) => {
    const {componentId} = req.body;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        Homepage.find({}, (errHomepage, home) => {
          if (errHomepage) {
            res.send({
              success: false,
              error: 'Error removing component.',
            });
          } else {
            const homepage = home[0];
            const components = homepage.components.slice();
            let hasChanged = false;
            components.forEach((component, i) => {
              if (component._id.toString() === componentId) {
                console.log('wow same');
                const newComponents = homepage.components.slice();
                newComponents.splice(i, 1);
                homepage.components = newComponents;
                hasChanged = true;
              }
            });
            if (hasChanged) {
              homepage.save();
              res.send({
                success: true,
                error: '',
              });
            } else {
              res.send({
                success: false,
                error: 'Error removing component.',
              });
            }
          }
        });
      }
    });
  });

  // Route to add content to an existing component
  router.post('/component/content/remove', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const {contentId, componentId} = req.body;
        if (!contentId || !componentId) {
          res.send({
            success: false,
            error: 'Error removing content.',
          });
        } else {
          // TODO implement
          Homepage.find({}, (errHome, home) => {
            if (errHome) {
              res.send({
                success: false,
                error: 'Error removing content.',
              });
            } else {
              const homepage = home[0];
              let hasChanged = false;
              homepage.components.forEach((comp, i) => {
                if (comp._id.toString() === componentId) {
                  comp.content.forEach((content, j) => {
                    if (content.contentId === contentId) {
                      const newContent = comp.content.slice();
                      newContent.splice(j, 1);
                      homepage.components[i].content = newContent;
                      hasChanged = true;
                    }
                  });
                }
              });
              if (hasChanged) {
                homepage.save();
                res.send({
                  success: true,
                  error: '',
                });
              } else {
                res.send({
                  success: false,
                  error: 'Error removing content.'
                });
              }
            }
          });
        }
      }
    });
  });

  // Route to add content to an existing component
  router.post('/component/content/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const { component, contentId } = req.body;
        let newContentType = '';
        if (!contentId) {
          res.send({
            success: false,
            error: 'Content ID must be provided.',
          });
        } else {
          Article.findById(contentId, (errArt, article) => {
            Listing.findById(contentId, (errList, listing) => {
              Video.findById(contentId, (errVid, video) => {
                if (errArt || errList || errVid) {
                  res.send({
                    success: false,
                    error: 'Error adding content.',
                  });
                } else if (!article && !listing && !video) {
                  res.send({
                    success: false,
                    error: 'No content found with given id found.',
                  });
                } else {
                  if (article) {
                    newContentType = 'Articles';
                  } else if (listing) {
                    newContentType = 'Listings';
                  } else if (video) {
                    newContentType = 'Videos';
                  }
                  Homepage.find({}, (errHome, home) => {
                    if (errHome) {
                      res.send({
                        success: false,
                        error: 'Error adding content.'
                      });
                    } else {
                      const homepage = home[0];
                      let hasChanged = false;
                      let contentExists = false;
                      homepage.components.forEach((comp, i) => {
                        if (comp._id.toString() === component._id && comp.contentType === newContentType) {
                          const newContent = homepage.components[i].content.slice();
                          newContent.forEach(cont => {
                            if (cont.contentId === contentId) {
                              contentExists = true;
                            }
                          });
                          if (!contentExists) {
                            newContent.push({contentId});
                            homepage.components[i].content = newContent;
                            hasChanged = true;
                          }
                        }
                      });
                      if (hasChanged && !contentExists) {
                        homepage.save(saveErr => {
                          if (saveErr) {
                            res.send({
                              success: false,
                              error: 'Error adding content.',
                            });
                          } else {
                            res.send({
                              success: true,
                              error: ''
                            });
                          }
                        });
                      } else {
                        res.send({
                          success: false,
                          error: 'Cannot add content. Make sure it is the right type and is not repeat.',
                        });
                      }
                    }
                  });
                }
              });
            });
          });
        }
      }
    });
  });

  return router;
};
