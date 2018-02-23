/**
 * Handles all backend routes for homepage
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const User = require('../models/user');
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');

// Import helper methods
const {AdminCheck} = require('../helperMethods/authChecking');

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

  router.post('/banner/add', (req, res) => {
    console.log('enters');
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const contentToAdd = req.body.contentToAdd;
        const contentImage = req.body.contentImage;
        // TODO add banner
        // TODO error check to make sure content exists
        Listing.findById(contentToAdd, (listing, errListing) => {
          Article.findById(contentToAdd, (article, errArticle) => {
            // Pass back errors
            if (errListing || errArticle) {
              res.send({
                success: false,
                error: 'Error finding content.',
              });
              // Make sure id is of right format
            } else if (!contentToAdd.match(/^[0-9a-fA-F]{24}$/)) {
              console.log('wrong format');
              res.send({
                success: false,
                error: 'No content with that id exists.'
              });
              // Make sure content with given id exists
            } else if (!article && !listing) {
              res.send({
                success: false,
                error: 'No content with that ID exists.',
              });
            } else {
              // Find homepage
              Homepage.find({}, (errHomepage, home) => {
                if (errHomepage) {
                  res.send({
                    success: false,
                    error: errHomepage,
                  });
                } else {
                  const homepage = home[0];
                  const banner = homepage.banner.slice();
                  // Create object to pass back, of type article or listing
                  const newBannerContent = {
                    type: article ? "article" : "listing",
                    contentId: contentToAdd,
                    contentImage,
                  };
                  // TODO error check size???
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
                        newBannerContent,
                      });
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  });
  return router;
};
