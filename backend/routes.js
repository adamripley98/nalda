/**
 * Handles all backend routes
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 * TODO file should be split up into many smaller files
 * TODO when pulling users, should not pull password and other private information
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
   * Route to handle adding new admins
   * Admins are allowed to add more admins/curators and create content
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
          error: errArticle
        });
      }
      // Now search through listings
      Listing.find({"$text": { $search: req.body.search }}, (errListing, listings) => {
        // Error finding listings
        if (errListing) {
          res.send({
            success: false,
            error: errListing,
          });
        }
        // Now search through videos
        Video.find({"$text": { $search: req.body.search }}, (errVideo, videos) => {
          // Error finding videos
          if (errVideo) {
            res.send({
              success: false,
              error: errVideo,
            });
          }
          // Now search through users
          User.find({"$text": { $search: req.body.search }}, (errUser, users) => {
            // Error finding users
            if (errUser) {
              res.send({
                success: false,
                error: errUser,
              });
            }
            // Make sure that users are curators or admins, do not want to be able to search for regular users
            const curators = [];
            // Check each user to make sure they are admin or curator before returning
            users.forEach((user) => {
              if (user.userType !== 'user') {
                curators.push(user);
              }
            });
            // TODO: Display all of their content as well
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
          });
        });
      });
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
   * Pull a specific video from the database
   */
  router.get('/videos/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Pull specific video from mongo
    Video.findById(id, (err, video) => {
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      // If the video doesn't exist
      } else if (!video) {
        res.send({
          success: false,
          error: "Video not found",
        });
      // if no errors, return video
      } else {
        res.send({
          success: true,
          data: video,
        });
      }
    });
  });


  /**
   * Route to handle a new video submission
   * @param title
   * @param url
   * @param description
   * TODO error checking
   */
  router.post('/videos/new', (req, res) => {
    // Isolate variables
    const title = req.body.title;
    const url = req.body.url;
    const description = req.body.description;

    let error = "";
    const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    // Perform error checking on variables
    if (!title) {
      error = "Title must be populated.";
    } else if (!description) {
      error = "Subtitle must be populated.";
    } else if (!urlRegexp.test(url)) {
      error = "Image must be a valid URL to an image.";
    }

    // If there was an error or not
    if (error) {
      res.send({
        success: false,
        error,
      });
    } else {
      // Create a new video with given data
      // TODO: Add location
      const newVideo = new Video({
        title,
        url,
        description,
      });

      // Save the new video in Mongo
      newVideo.save((errVideo, video) => {
        if (errVideo) {
          // If there was an error saving the video
          res.send({
            success: false,
            error: errVideo,
          });
        } else {
          // Successfully send back data
          res.send({
            success: true,
            data: video,
          });
        }
      });
    }
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
        // Add a timestamp field for sorting
        articles.forEach((article) => {
          article.createdAt = article._id.getTimestamp();
          article.save();
        });
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
   * TODO error checking
   */
  router.post('/articles/new', (req, res) => {
    // Isolate variables
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const image = req.body.image;
    const body = req.body.body;
    const userId = req.body.userId;

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
    } else {
      for (let i = 0; i < body.length && !error; i++) {
        const component = body[i];
        if (!component) {
          error = "Each component must be defined.";
        } else if (!component.body) {
          error = "Each component must be populated with text.";
        } else if (component.componentType !== "text" && component.componentType !== "image") {
          error = "Component type must be either text or image.";
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
      User.findById(userId, (err, user) => {
        if (err) {
          res.send({
            success: false,
            error: 'Error finding author ' + err
          });
        } else if (!user) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
          // Creates a new article with given params
          const newArticle = new Article({
            title,
            subtitle,
            image,
            body,
            author: userId,
          });

          // Save the new article in Mongo
          newArticle.save((errr, article) => {
            if (errr) {
              // If there was an error saving the article
              res.send({
                success: false,
                error: errr.message,
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
        User.findById(article.author, (er, user) => {
          if (er) {
            // Error finding author
            res.send({
              success: false,
              error: er,
            });
          } else if (!user) {
            res.send({
              success: false,
              error: 'Cannot find author.',
            });
          } else {
            // Author found
            res.send({
              success: true,
              data: article,
              timestamp: article._id.getTimestamp(),
              author: {
                name: user.name,
                profilePicture: user.profilePicture,
                _id: user._id,
              }
            });
          }
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
    const amenities = req.body.amenities;
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
        amenities,
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
          // TODO: Update user's content
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
   * Route to add a new review
   * @param userId
   * @param listingId
   * @param rating
   * @param title
   * @param content
   */
  router.post('/reviews/new', (req, res) => {
    // Ensure that a user is logged in before reviewing
    if (!req.body.userId) {
      res.send({
        success: false,
        error: 'You must be logged in in order to leave a review on a listing.'
      });
    }

    // Ensure all fields are populated before leaving review
    if (!req.body.rating || !req.body.title || !req.body.content) {
      res.send({
        success: false,
        error: 'All fields must be populated.'
      });
    }

    // If user is logged in, first find author in MongoDB
    User.findById(req.body.userId, (err, user) => {
      // Error finding user
      if (err) {
        res.send({
          success: false,
          error: 'Error finding user' + err,
        });
      }

      // If user doesn't exist
      if (!user) {
        res.send({
          success: false,
          error: 'User does not exist.'
        });
      }

      // If no errors can now save new reviews
      // First find given listing
      Listing.findById(req.body.listingId, (errr, listing) => {
        // Error finding listing
        if (errr) {
          res.send({
            success: false,
            error: errr
          });
        }

        // Listing doesn't exist for some reason
        if (!listing) {
          res.send({
            success: false,
            error: 'Cannot find listing.',
          });
        }

        // If listing has been found, update it with review
        const currentReviews = listing.reviews;

        // Add new review to array of current reviews
        currentReviews.push({
          rating: req.body.rating,
          title: req.body.title,
          content: req.body.content,
          createdAt: new Date().getTime(),
          name: user.name,
        });

        // Update listing with new review
        listing.reviews = currentReviews;

        // Resave listing in Mongo
        listing.save((er) => {
          // Error saving listing
          if (er) {
            res.send({
              success: false,
              error: 'Error saving review' + er,
            });
          }

          // Finally, if review is saved successfully
          res.send({
            success: true,
            error: '',
          });
        });
      });
    });
  });

  /**
   * Update a user's name
   * TODO: Error check and ensure full name was entered
   */
  router.post('/users/name', (req, res) => {
    // Isolate variables from the request
    const name = req.body.name;
    const userId = req.body.userId;

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
      // Search for user in Mongo
      User.findById(userId, (err, user) => {
        // Error finding user
        if (err) {
          res.send({
            success: false,
            error: err,
          });
        // User doesn't exist in Mongo
        } else if (!user) {
          res.send({
            success: false,
            error: 'Cannot find user.'
          });
        } else {
          // Update user with new name
          user.name = name;

          // Save in Mongo
          user.save((errr) => {
            // Error saving user
            if (err) {
              res.send({
                success: false,
                error: errr,
              });
            } else {
              // User name updated successfully
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

  /**
   * Update a user's bio
   */
  router.post('/users/bio', (req, res) => {
    // Isolate variables from the request
    const bio = req.body.bio;
    const userId = req.body.userId;

    // Error checking
    if (bio.length > 500) {
      res.send({
        success: false,
        error: "Bio length cannot exceed 500 characters.",
      });
    } else {
      // Search for user in Mongo
      User.findById(userId, (err, user) => {
        // Error finding user
        if (err) {
          res.send({
            success: false,
            error: err,
          });
        // User doesn't exist in Mongo
        } else if (!user) {
          res.send({
            success: false,
            error: 'Cannot find user.'
          });
        } else {
          // Update user with new bio
          user.bio = bio;

          // Save in Mongo
          user.save((errr) => {
            // Error saving user
            if (err) {
              res.send({
                success: false,
                error: errr,
              });
            } else {
              // User bio updated successfully
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

  /**
   * Find a given user's profile
   */
  router.get('/users/:id', (req, res) => {
    // Find the id from the url
    const id = req.params.id;

    // Find user's profile in Mongo
    User.findById(id, (err, user) => {
      // Error finding user
      if (err) {
        res.send({
          success: false,
          error: err,
        });
      } else if (!user) {
        // User doesn't exist in mongo
        res.send({
          success: false,
          error: 'User does not exist.'
        });
      // Otherwise render user data
      } else {
        // TODO: Populate user's content
        Article.find({author: id}, (er, articles) => {
          // Error checking
          if (er) {
            res.send({
              success: false,
              error: er,
            });
          }
          res.send({
            success: true,
            error: '',
            data: user,
            articles,
          });
        });
      }
    });
  });

  // Route to send an email to Nalda team
  // TODO: implement
  router.post('/contact', (req, res) => {
    res.send({
      success: false,
      error: 'This feature has not been connected yet.'
    });
    // console.log('enters contact');
    // const nodemailer = require('nodemailer');
    //
    // // Generate test SMTP service account from ethereal.email
    // // Only needed if you don't have a real mail account for testing
    //   // create reusable transporter object using the default SMTP transport
    // // const transporter = nodemailer.createTransport({
    // //   host: 'smtp.ethereal.email',
    // //   port: 587,
    // //   secure: false, // true for 465, false for other ports
    // //   auth: {
    // //     user: 'username', // generated ethereal user
    // //     pass: 'password'  // generated ethereal password
    // //   }
    // // });
    //
    // const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
    //
    // // setup email data with unicode symbols
    // const mailOptions = {
    //   from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    //   to: 'adamripley@gmail.com', // list of receivers
    //   subject: 'Hello ✔', // Subject line
    //   text: 'Hello world?', // plain text body
    //   html: '<b>Hello world?</b>' // html body
    // };
    //
    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     // return console.log(error);
    //     console.log('error sending', error);
    //     res.send({
    //       error: 'Error sending message' + error
    //     });
    //   } else {
    //     console.log('wow it worked');
    //     res.send({
    //       data: 'lol it worked',
    //     });
    //   }
    //   // Preview only available when sending through an Ethereal account
    //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    //
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // });
  });
  // Return the router for use throughout the application
  return router;
};
