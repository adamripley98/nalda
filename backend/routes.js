/**
 * Handles all backend routes
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

  /**
   * Route to handle adding new admins, admins allowed to add more admins/curators and create content
   * @param userToAdd
   */
  router.post('/admin/new', (req, res) => {
    // finds given user in Mongo
    User.findOne({username: req.body.userToAdd}, (err, user) => {
      // Lets them know that if there is an error
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // Makes sure that user exists
      } else if (!user) {
        res.send({
          success: false,
          error: req.body.userToAdd + 'does not seem to exist!'
        });
      } else {
        // Makes given user an admin
        user.userType = "admin";
        user.save((err2) => {
          if (err2) {
            res.send({
              success: false,
              error: err2,
            });
          }
          // If no error saving new user, returns successfully
          res.send({
            success: true,
          });
        });
      }
    });
  });

  /**
   * Route to handle adding new curators, allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/new', (req, res) => {
    // finds given user in Mongo
    User.findOne({username: req.body.userToAdd}, (err, user) => {
      // Lets them know that if there is an error
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // Makes sure that user exists
      } else if (!user) {
        res.send({
          success: false,
          error: req.body.userToAdd + ' does not seem to exist!'
        });
      } else {
        // Makes given user an admin
        user.userType = "curator";
        user.save((err2) => {
          if (err2) {
            res.send({
              success: false,
              error: err2,
            });
          }
          // If no error saving new user, returns successfully
          res.send({
            success: true,
          });
        });
      }
    });
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
          error: articleErr,
        });
      } else {
        /**
         * Find the four most recent articles
         * TODO leverage timestamps
         */
        let recentArticles;
        if (articles.length <= 4) {
          recentArticles = articles;
        } else {
          recentArticles = articles.slice(articles.length - 4);
        }

        // Find listings
        Listing.find((listingErr, listings) => {
          if (listingErr) {
            res.send({
              success: false,
              error: listingErr,
            });
          } else {
            /**
             * Find the four most recent listings
             * TODO leverage timestamps
             */
            let recentListings;
            if (listings.length <= 4) {
              recentListings = listings;
            } else {
              recentListings = listings.slice(listings.length - 4);
            }

            // Find videos
            Video.find((videoErr, videos) => {
              if (videoErr) {
                res.send({
                  success: false,
                  error: videoErr,
                });
              } else {
                /**
                 * Find the four most recent videos
                 * TODO leverage timestamps
                 */
                let recentVideos;
                if (videos.length <= 4) {
                  recentVideos = videos;
                } else {
                  recentVideos = videos.slice(videos.length - 4);
                }

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
   * Pull all videos from the database
   */
  router.get('/videos', (req, res) => {
    // Pulls videos from mongo
    Video.find((err, videos) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If everything went as planned
        res.send({
          success: true,
          data: videos,
        });
      }
    });
  });

  /**
   * Pull all listings from the database
   */
  router.get('/listings', (req, res) => {
    // Pulls articles from mongo
    Listing.find((err, listings) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If everything went as planned
        res.send({
          success: true,
          data: listings,
        });
      }
    });
  });

  /**
   * Route to receive user's information from Mongo
   * @param userID
   */
  router.get('/account', (req, res) => {
    User.findById(req.query.userId, (err, user) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
        // If no user exists
      } else if (!user) {
        res.send({
          success: false,
          error: 'Can not find user',
        });
      } else {
        // If everything went as planned, send back user
        res.send({
          success: true,
          data: user,
        });
      }
    });
  });

  /**
   * Pull all articles from the database
   */
  router.get('/articles', (req, res) => {
    // Pulls articles from mongo
    Article.find((err, articles) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If everything went as planned
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
   * TODO error checking
   */
  router.post('/articles/new', (req, res) => {
    // Isolate variables
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const image = req.body.image;
    const body = req.body.body;
    let error = "";
    const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    // Perform error checking on variables
    if (!title) {
      error = "Title must be populated.";
    } else if (!subtitle) {
      error = "Subtitle must be populated.";
    } else if (!image) {
      error = "Image must be populated.";
    } else if (!body) {
      error = "Body must be populated.";
    } else if (!urlRegexp.test(image)) {
      error = "Image must be a valid URL to an image.";
    }

    // If there was an error or not
    if (error) {
      res.send({
        success: false,
        error,
      });
    } else {
      // Creates a new article with given params
      const newArticle = new Article({
        title,
        subtitle,
        image,
        body,
      });

      // Save the new article in Mongo
      newArticle.save((err, article) => {
        if (err) {
          // If there was an error saving the article
          res.send({
            success: false,
            error: err,
          });
        } else {
          res.send({
            success: true,
            data: article,
          });
        }
      });
    }
  });

  /**
   * Route to handle pulling the information for a specific article
   */
  router.get('/articles/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Pull specific article from mongo
    Article.findById(id, (err, article) => {
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // If the article doesn't exist
      } else if (!article) {
        res.send({
          success: false,
          error: "Article not found",
        });
        // if no errors, returns article along with the date it was created
      } else {
        res.send({
          success: true,
          data: article,
          timestamp: article._id.getTimestamp(),
        });
      }
    });
  });

  /**
   * Route to handle pulling the information for a specific listing
   */
  router.get('/listings/:id', (req, res) => {
    // Find the id from the listing url
    const id = req.params.id;

    // Pull specific listing from mongo
    Listing.findById(id, (err, listing) => {
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // If the listing doesn't exist
      } else if (!listing) {
        res.send({
          success: false,
          error: "Article not found",
        });
      // if no errors, returns article along with the date it was created
      } else {
        res.send({
          success: true,
          data: listing,
          timestamp: listing._id.getTimestamp(),
        });
      }
    });
  });

/**
 * Route to handle creating new listings
 * @param title
 * @param description
   * @param image
   * @param hours
   * @param rating (0.5 increments from 0 to 5)
   * @param price
   * @param website
   */
  router.post('/listings/new', (req, res) => {
    // Isolate variables from the body
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const hours = req.body.hours;
    const rating = req.body.rating;
    const price = req.body.price;
    const website = req.body.website;
    let error = "";

    // Error checking
    // TODO: error check for hours
    if (!title) {
      error = "Title must be populated.";
    } else if (!description) {
      error = "Description must be populated.";
    } else if (!image) {
      error = "Image must be populated.";
    } else if (!rating) {
      error = "Rating must be populated.";
    } else if (!price) {
      error = "Price must be populated.";
    } else if (!website) {
      error = "Website must be populated.";
    }

    // Handle error if there is one
    if (error) {
      res.send({
        success: false,
        error,
      });
    } else {
      // Creates a new listing with given params
      const newListing = new Listing({
        title,
        description,
        image,
        hours,
        rating,
        price,
        website,
      });

      // Save the new article in mongo
      newListing.save((er, listing) => {
        if (er) {
          // Pass on any error to the user
          res.send({
            success: false,
            error: er,
          });
        } else {
          // Send the data along if it was successfully stored
          res.send({
            success: true,
            data: listing,
          });
        }
      });
    }
  });

  /**
   * Update a user's name
   * TODO update the user
   */
  router.post('/users/name', (req, res) => {
    // Isolate variables from the request
    const name = req.body.name;

    // Error checking
    if (!name) {
      res.send({
        success: false,
        error: "Name must be populated",
      });
    } else if (!name.indexOf(" ")) {
      res.send({
        success: false,
        error: "Name must contain at least 1 space",
      });
    } else {
      // The name is properly formatted
      /**
       * TODO update the user
       */
    }
  });

  /**
   * Update a user's bio
   */
  router.post('/users/bio', (req, res) => {
    // Isolate variables from the request
    const bio = req.body.bio;

    // Error checking
    if (bio.length > 500) {
      res.send({
        success: false,
        error: "Bio length cannot exceed 500 characters.",
      });
    } else {
      /**
       * TODO make the request
       */
    }
  });

  /**
   * Update a user's password
   * @param String oldPassword
   * @param String newPassword
   * @param String newPasswordConfirm
   * TODO error checking for password strength
   * TODO update user
   */
  router.post('/users/password', (req, res) => {
    // Isolate variables from the request
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;

    // Error checking
    if (!oldPassword) {
      res.send({
        success: false,
        error: "Old password must be populated.",
      });
    } else if (!newPassword) {
      res.send({
        success: false,
        error: "New password must be populated.",
      });
    } else if (!newPasswordConfirm) {
      res.send({
        success: false,
        error: "New password confirmation must be populated.",
      });
    } else if (oldPassword === newPassword) {
      res.send({
        success: false,
        error: "New password must be unique from old password.",
      });
    } else if (newPassword !== newPasswordConfirm) {
      res.send({
        success: false,
        error: "New password and confirmation password must match.",
      });
    } else {
      /**
       * TODO perform error checking on password strength
       */
      res.send({
        success: false,
        error: "Not yet implemented.",
      });
    }
  });

  // Return the router for use throughout the application
  return router;
};
