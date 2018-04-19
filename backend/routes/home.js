/**
 * Handles all backend routes for homepage
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// TODO Generic add component, remove component routes. Also need add and remove content from a given component

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
            console.log(contentAsyncErr);
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


  // // Helper function to pull data for each of the different content types
  // const pullData = (components, callback) => {
  //   console.log('enters pull data');
  //   // Array of content to be returned
  //   const returnArr = [];
  //
  //   // Loop through array and pull pertinent data
  //   async.eachSeries(components, (component, cb) => {
  //     console.log('enters the async');
  //     // Find the model for pulling data based on the content type
  //     let Model = null;
  //     if (component.contentType === 'Articles') {
  //       console.log('art');
  //       Model = Article;
  //     } else if (component.contentType === 'Listings') {
  //       console.log('list');
  //       Model = Listing;
  //     } else if (component.contentType === 'Videos') {
  //       console.log('vid');
  //       Model = Video;
  //     } else {
  //       console.log('lol something is seriosuly wrong');
  //     }
  //     console.log('what is content', component, component.content);
  //     component.content.forEach(cont => {
  //       console.log('enters the foreach');
  //       Model.findById(cont.contentId, (errContent, content) => {
  //         if (errContent) {
  //           console.log('err content', errContent);
  //           callback({
  //             success: false,
  //             error: 'Error fetching homepage content',
  //           });
  //         } else if (content) {
  //           console.log('there is content yes');
  //           let newContent = {};
  //           if (component.contentType === 'article') {
  //             newContent = {
  //               contentType: component.contentType,
  //               contentId: cont.contentId,
  //               title: content.title,
  //               subtitle: content.subtitle,
  //               image: content.image,
  //               createdAt: content.createdAt,
  //               updatedAt: content.updatedAt,
  //               location: content.location,
  //             };
  //           } else if (component.contentType === 'listing') {
  //             newContent = {
  //               contentType: component.contentType,
  //               contentId: cont.contentId,
  //               title: content.title,
  //               description: content.description,
  //               location: content.location,
  //               image: content.image,
  //               rating: content.rating,
  //               price: content.price,
  //               categories: content.categories,
  //             };
  //           } else {
  //             // Content is a video
  //             newContent = {
  //               contentType: component.contentType,
  //               contentId: cont.contentId,
  //               title: content.title,
  //               description: content.description,
  //               url: content.url,
  //               location: content.location,
  //               createdAt: content.createdAt,
  //               updatedAt: content.updatedAt,
  //             };
  //           }
  //
  //           // Add the new content to the array and continue looping
  //           returnArr.push(newContent);
  //           cb();
  //         } else {
  //           // TODO do i need to deal with when content doesn't exist anymore?? shouldnt crash entire app
  //           console.log('errrrr content not found');
  //           cb();
  //         }
  //       });
  //     });
  //   }, (asyncErr) => {
  //     if (asyncErr) {
  //       console.log('async err');
  //       callback({
  //         success: false,
  //         error: 'Error loading homepage.'
  //       });
  //     } else {
  //       console.log('no err');
  //       callback({
  //         success: true,
  //         error: '',
  //         returnArr,
  //       });
  //       return;
  //     }
  //   });
  // };
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
        console.log('there are components');
        pullData(homepage.components, (resp) => {
          console.log('a response comes back from pulldata', resp);
          if (!resp.success) {
            res.send({
              success: false,
              error: resp.error,
            });
          } else {
            // homepage.components = resp.returnComponents;
            // homepage.save((errSave) => {
            //   if (errSave) {
            //     res.send({
            //       success: false,
            //       error: 'Error getting admin data.',
            //     });
            //     return;
            //   }

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

            // });
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

  // Route to handle adding content to homepage recommended
  router.post('/recommended/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const contentId = req.body.contentId;
        Listing.findById(contentId, (errListing, listing) => {
          if (errListing) {
            res.send({
              success: false,
              error: 'Error finding content.'
            });
          // Make sure id is of right format
          } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
            res.send({
              success: false,
              error: 'No listing with that id exists.'
            });
            // Make sure content with given id exists
          } else if (!listing) {
            res.send({
              success: false,
              error: 'No listing with that ID exists.',
            });
          } else {
            Homepage.find({}, (errHomepage, home) => {
              if (errHomepage) {
                res.send({
                  success: false,
                  error: 'Error loading homepage.',
                });
              } else {
                const homepage = home[0];
                const recommended = homepage.recommended.slice();
                // Error check for duplicate content in banner
                let duplicate = false;
                recommended.forEach((item) => {
                  if (item.contentId === contentId) {
                    duplicate = true;
                  }
                });
                if (duplicate) {
                  res.send({
                    success: false,
                    error: 'This listing is already in the recommended content section.',
                  });
                } else {
                  // Create object to pass back, of type listing
                  const newRecommendedContent = {
                    contentType: 'listing',
                    contentId,
                  };
                  // Add to Recommended
                  recommended.push(newRecommendedContent);
                  homepage.recommended = recommended;
                  // Save new banner to mongo
                  homepage.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: 'Error adding recommended.',
                      });
                    } else {
                      res.send({
                        success: true,
                        error: '',
                        data: homepage.recommended,
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
  });

  // Route to handle deleting an item from the recommended
  router.post('/recommended/remove/:recommendedContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.recommendedContentId;
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
            const recommended = homepage.recommended.slice();
            // Loop through to delete specific item
            recommended.forEach((item) => {
              if (item.contentId === contentId) {
                recommended.splice(recommended.indexOf(item), 1);
                return;
              }
            });
            homepage.recommended = recommended;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: 'Error removing recommended.',
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.recommended,
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to handle adding content to homepage from the editors
  router.post('/fromTheEditors/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const contentId = req.body.contentId;
        Article.findById(contentId, (errArticle, article) => {
          if (errArticle) {
            res.send({
              success: false,
              error: 'Error finding article.'
            });
          // Make sure id is of right format
          } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
            res.send({
              success: false,
              error: 'No article with that id exists.'
            });
            // Make sure article with given id exists
          } else if (!article) {
            res.send({
              success: false,
              error: 'No article with that ID exists.',
            });
          } else {
            Homepage.find({}, (errHomepage, home) => {
              if (errHomepage) {
                res.send({
                  success: false,
                  error: 'Error loading homepage.',
                });
              } else {
                const homepage = home[0];
                const fromTheEditors = homepage.fromTheEditors.slice();
                // Error check for duplicate content in banner
                let duplicate = false;
                fromTheEditors.forEach((item) => {
                  if (item.contentId === contentId) {
                    duplicate = true;
                  }
                });
                if (duplicate) {
                  res.send({
                    success: false,
                    error: 'This article is already in the from the editors content section.',
                  });
                } else {
                  // Create object to pass back, of type article
                  const newFromTheEditorsContent = {
                    contentType: 'article',
                    contentId,
                  };
                  // Add to from the editors
                  fromTheEditors.push(newFromTheEditorsContent);
                  homepage.fromTheEditors = fromTheEditors;
                  // Save new banner to mongo
                  homepage.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: 'Error adding content to homepage.',
                      });
                    } else {
                      res.send({
                        success: true,
                        error: '',
                        data: homepage.fromTheEditors,
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
  });

  // Route to handle deleting an item from the from the editors
  router.post('/fromTheEditors/remove/:fromTheEditorsContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.fromTheEditorsContentId;
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
            const fromTheEditors = homepage.fromTheEditors.slice();
            // Loop through to delete specific item
            fromTheEditors.forEach((item) => {
              if (item.contentId === contentId) {
                fromTheEditors.splice(fromTheEditors.indexOf(item), 1);
                return;
              }
            });
            homepage.fromTheEditors = fromTheEditors;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: "error removing homeepage content.",
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.fromTheEditors,
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to handle adding content to homepage nalda videos
  router.post('/naldaVideos/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const contentId = req.body.contentId;
        Video.findById(contentId, (errVideo, video) => {
          if (errVideo) {
            res.send({
              success: false,
              error: 'Error finding content.'
            });
          } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
            res.send({
              success: false,
              error: 'No video with that id exists.'
            });
            // Make sure content with given id exists
          } else if (!video) {
            res.send({
              success: false,
              error: 'No video with that ID exists.',
            });
          } else {
            Homepage.find({}, (errHomepage, home) => {
              if (errHomepage) {
                res.send({
                  success: false,
                  error: 'Error loading homepage.',
                });
              } else {
                const homepage = home[0];
                const naldaVideos = homepage.naldaVideos.slice();
                // Error check for duplicate content in banner
                let duplicate = false;
                naldaVideos.forEach((item) => {
                  if (item.contentId === contentId) {
                    duplicate = true;
                  }
                });
                if (duplicate) {
                  res.send({
                    success: false,
                    error: 'This content is already in the Nalda Videos content section.',
                  });
                } else {
                  // Create object to pass back, of type article or listing
                  const newNaldaVideoContent = {
                    contentType: 'video',
                    contentId,
                  };
                  // Add to Nalda Video
                  naldaVideos.push(newNaldaVideoContent);
                  homepage.naldaVideos = naldaVideos;
                  // Save new banner to mongo
                  homepage.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: 'Error adding content to homepage.',
                      });
                    } else {
                      res.send({
                        success: true,
                        error: '',
                        data: homepage.naldaVideos,
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
  });

  // Route to handle deleting an item from the nalda videos
  router.post('/naldaVideos/remove/:naldaVideosContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.naldaVideosContentId;
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
            const naldaVideos = homepage.naldaVideos.slice();
            // Loop through to delete specific item
            naldaVideos.forEach((item) => {
              if (item.contentId === contentId) {
                naldaVideos.splice(naldaVideos.indexOf(item), 1);
                return;
              }
            });
            homepage.naldaVideos = naldaVideos;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: 'Error removing content from homepage.',
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.naldaVideos,
                });
              }
            });
          }
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
      } else {
        const { title, subtitle, contentType } = req.body;
        if (!title || !subtitle || !contentType) {
          res.send({
            success: false,
            error: 'Form must be filled out completely.',
          });
        } else {
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
            } else {
              const newComp = {
                title,
                subtitle,
                contentType,
                content: [],
              };
              Homepage.find({}, (errHome, home) => {
                const homepage = home[0];
                const components = homepage.components.slice();
                components.push(newComp);
                homepage.components = components;
                homepage.save((errSave) => {
                  if (errSave) {
                    res.send({
                      success: false,
                      error: 'Error adding component.',
                    });
                  } else {
                    res.send({
                      success: true,
                      data: component,
                    });
                  }
                });
              });
            }
          });
        }
      }
    });
  });

  // Route to delete a given component from homepage
  // TODO remove from homepage instead of from home
  router.post('/component/remove/:componentId', (req, res) => {
    const {componentId} = req.params;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        HomeComponent.findById(componentId, (err, component) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error deleting component.',
            });
          } else {
            component.remove((errRemove) => {
              if (errRemove) {
                res.send({
                  success: false,
                  error: 'Error deleting component',
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
  });

  // Route to add content to an existing component
  // TODO check to ensure correct type. If nothing matches, deal with this as well.
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
        console.log('what is component', component);
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
                  // TODO dklaflsdkj
                  Homepage.find({}, (errHome, home) => {
                    if (errHome) {
                      res.send({
                        success: false,
                        error: 'Error adding content.'
                      });
                    } else {
                      const homepage = home[0];
                      let hasChanged = false;
                      homepage.components.forEach((comp, i) => {
                        console.log('what is index', i);
                        console.log('what is comp', comp);
                        console.log('what is component type', comp.componentType);
                        console.log('what is component id', comp._id.toString(), typeof comp._id.toString());
                        console.log('what is comonent id', component._id, typeof component._id);
                        console.log(' what are content types', comp.contentType, newContentType);
                        if (comp._id.toString() === component._id && comp.contentType === newContentType) {
                          console.log('same wow', comp);
                          const newContent = homepage.components[i].content.slice();
                          newContent.push({contentId});
                          console.log('cont b4', homepage.components[i].content);
                          homepage.components[i].content = newContent;
                          console.log('cont after', homepage.components[i].content);
                          hasChanged = true;
                        } else {
                          console.log('not same');
                        }
                      });
                      if (hasChanged) {
                        console.log('what is new homepage', homepage);
                        homepage.save(saveErr => {
                          if (saveErr) {
                            res.send({
                              success: false,
                              error: 'Error adding content.',
                            });
                          } else {
                            console.log('content added!');
                            res.send({
                              success: true,
                              error: ''
                            });
                          }
                        });
                      } else {
                        res.send({
                          success: false,
                          error: 'Content not found.',
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
