/**
 * Handles all backend routes for searching, loading home data, and syncing state
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Import database models
const Article = require('./models/article');
const Listing = require('./models/listing');
const Video = require('./models/video');
const User = require('./models/user');

// Import helper methods
const {UserCheck} = require('./helperMethods/authChecking');

// Export the following methods for routing
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

  router.get('/sync', (req, res) => {
    // If passport state is not present, user is not logged in on the backend
    if (!req.session.passport) {
      // States are NOT synced!
      res.send({
        success: false,
        data: 'States are not synced!'
      });
    } else {
      // States are synced!
      res.send({
        success: true,
        data: 'States are synced!',
      });
    }
  });

  /**
   * Get content for the homepage
   * 4 most recent articles, listings, and videos
   * TODO pull content from the user's location
   */
  router.get('/home', (req, res) => {
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

  /**
   * Pull listings, videos, articles, and curators from the database based off what is searched for
   * @param search (what term user searched for)
   */
  router.post('/search', (req, res) => {
    // First search through articles
    Article.find({"$text": { $search: req.body.search }}, (errArticle, articles) => {
      // Error finding articles
      if (errArticle) {
        res.send({
          success: false,
          error: errArticle.message
        });
      } else {
        // Now search through listings
        // TODO: Don't allow search through reviewers
        Listing.find({"$text": { $search: req.body.search }}, (errListing, listings) => {
          // Error finding listings
          if (errListing) {
            res.send({
              success: false,
              error: errListing.message,
            });
          } else {
            // Now search through videos
            Video.find({"$text": { $search: req.body.search }}, (errVideo, videos) => {
              // Error finding videos
              if (errVideo) {
                res.send({
                  success: false,
                  error: errVideo.message,
                });
              } else {
                // Now search through users
                User.find({"$text": { $search: req.body.search }}, (errUser, users) => {
                  // Error finding users
                  if (errUser) {
                    res.send({
                      success: false,
                      error: errUser.message,
                    });
                  } else {
                    // Make sure that users are curators or admins, do not want to be able to search for regular users
                    const curators = [];
                    // Check each user to make sure they are admin or curator before returning
                    users.forEach((user) => {
                      if (user.userType !== 'user') {
                        curators.push(user);
                      }
                    });
                    // Do not return private information about curators (password, username, etc)
                    curators.forEach((curator) => {
                      curator.password = '';
                      curator.userType = '';
                      curator.username = '';
                    });
                    // If there were no errors, send back all data
                    res.send({
                      success: true,
                      error: '',
                      data: {
                        articles,
                        listings,
                        videos,
                        curators,
                      },
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

  /**
   * Route to receive user's information from Mongo
   * @param userID
   */
  router.get('/account', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      // Check to make sure user is accessing their own data
      // TODO Will need to change once we don't pass userId from frontend
      } else if (req.session.passport.user !== req.query.userId) {
        res.send({
          success: false,
          error: 'You may only access your own information.'
        });
      } else {
          // Find user in Mongo
        User.findById(req.session.passport.user, (err, user) => {
          if (err) {
          // If there was an error with the request
            res.send({
              success: false,
              error: err.message,
            });
            // If no user exists
          } else if (!user) {
            res.send({
              success: false,
              error: 'Can not find user',
            });
          } else {
            // If everything went as planned, send back user
            // Remove private user info first
            user.password = '';
            res.send({
              success: true,
              data: user,
            });
          }
        });
      }
    });
  });


  // Return the router for use throughout the application
  return router;
};
