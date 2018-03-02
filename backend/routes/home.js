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

// Import database models
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');

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
  /**
   * Get content for the homepage
   * 4 most recent articles, listings, and videos
   * TODO pull content from the user's location
   // TODO pull from new homepage model
   */
  router.get('/', (req, res) => {
    // Start by finding articles
    Article.find((articleErr, articles) => {
      if (articleErr) {
        res.send({
          success: false,
          error: articleErr.message,
        });
      } else {
        /**
         * Find the four most recent articles
         */
        let recentArticles;
        if (articles.length <= 4) {
          recentArticles = articles;
        } else {
          recentArticles = articles.slice(articles.length - 4);
        }

        // Display in correct order
        recentArticles.reverse();

        // Find listings
        Listing.find((listingErr, listings) => {
          if (listingErr) {
            res.send({
              success: false,
              error: listingErr.message,
            });
          } else {
            /**
             * Find the four most recent listings
             */
            let recentListings;
            if (listings.length <= 4) {
              recentListings = listings;
            } else {
              recentListings = listings.slice(listings.length - 4);
            }

            // Display in correct order
            recentListings.reverse();

            // Find videos
            Video.find((videoErr, videos) => {
              if (videoErr) {
                res.send({
                  success: false,
                  error: videoErr.message,
                });
              } else {
                /**
                 * Find the four most recent videos
                 */
                let recentVideos;
                if (videos.length <= 4) {
                  recentVideos = videos;
                } else {
                  recentVideos = videos.slice(videos.length - 4);
                }

                // Display in correct order
                recentVideos.reverse();

                // Send the articles, listings, and videos
                res.send({
                  success: true,
                  data: {
                    articles: recentArticles,
                    listings: recentListings,
                    videos: recentVideos,
                  },
                });
              }
            });
          }
        });
      }
    });
  });

  router.get('/testing', (req, res) => {
    console.log('enters testing');
    Homepage.find({}, (errHome, home) => {
      if (errHome) {
        res.send({
          success: false,
          error: 'Cannot return homepage.',
        });
      } else {
        const homepage = home[0];
        res.send({
          success: true,
          error: '',
          data: {
            banner: homepage.banner,
          }
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
          Article.findById(contentId, (errArticle, article) => {
            Video.findById(contentId, (errVideo, video) => {
              if (errListing || errArticle || errVideo) {
                res.send({
                  success: false,
                  error: 'Error finding content.'
                });
              // Make sure id is of right format
              } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
                res.send({
                  success: false,
                  error: 'No content with that id exists.'
                });
                // Make sure content with given id exists
              } else if (!article && !listing && !video) {
                res.send({
                  success: false,
                  error: 'No content with that ID exists.',
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
                        error: 'This content is already in the recommended content section.',
                      });
                    } else {
                      // Create object to pass back, of type article or listing
                      let contentType = '';
                      if (article) {
                        contentType = 'article';
                      } else if (listing) {
                        contentType = 'listing';
                      } else {
                        contentType = 'video';
                      }
                      const newRecommendedContent = {
                        contentType,
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
                            error: errSave,
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
          });
        });
      }
    });
  });

  // Route to handle deleting an item from the recommended
  router.post('/recommended/remove/:recommendedContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.recommendedContentId;
    console.log('cc', contentId);
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
                  error: errHome,
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
        Listing.findById(contentId, (errListing, listing) => {
          Article.findById(contentId, (errArticle, article) => {
            Video.findById(contentId, (errVideo, video) => {
              if (errListing || errArticle || errVideo) {
                res.send({
                  success: false,
                  error: 'Error finding content.'
                });
              // Make sure id is of right format
              } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
                res.send({
                  success: false,
                  error: 'No content with that id exists.'
                });
                // Make sure content with given id exists
              } else if (!article && !listing && !video) {
                res.send({
                  success: false,
                  error: 'No content with that ID exists.',
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
                        error: 'This content is already in the from the editors content section.',
                      });
                    } else {
                      // Create object to pass back, of type article or listing
                      let contentType = '';
                      if (article) {
                        contentType = 'article';
                      } else if (listing) {
                        contentType = 'listing';
                      } else {
                        contentType = 'video';
                      }
                      const newFromTheEditorsContent = {
                        contentType,
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
                            error: errSave,
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
          });
        });
      }
    });
  });

  // Route to handle deleting an item from the from the editors
  router.post('/recommended/remove/:fromTheEditorsContentId', (req, res) => {
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
                  error: errHome,
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
              // Create bucket
              s3bucket.createBucket(() => {
                var params = {
                  Bucket: AWS_BUCKET_NAME,
                  Key: `bannerpictures/${uuid()}`,
                  ContentType: 'image/jpeg',
                  Body: imageConverted,
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
                          error: errHomepage,
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
                              error: err,
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
                                error: errSave,
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
                  error: errHome,
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

  return router;
};
