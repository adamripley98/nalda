/**
 * Handles all backend routes
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 * TODO file should be split up into many smaller files
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
    let userId = '';
    // Assign userId to user in backend
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // If user doesn't exist
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.',
      });
    } else {
      // Find the admin in Mongo
      User.findById(userId, (errAdmin, admin) => {
        // Error finding admin
        if (errAdmin) {
          res.send({
            success: false,
            error: errAdmin.message,
          });
        // Can't find admin
        } else if (!admin) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
          // Check if user is an admin
          if (admin.userType !== 'admin') {
            res.send({
              success: false,
              error: 'You must be an admin to post.'
            });
          } else {
            // If user is an admin, finds given user to add in Mongo
            User.findOne({username: req.body.userToAdd}, (err, user) => {
              // Lets them know that if there is an error
              if (err) {
                res.send({
                  success: false,
                  error: err.message,
                });
              // Makes sure that user exists
              } else if (!user) {
                res.send({
                  success: false,
                  error: req.body.userToAdd + ' does not seem to exist!'
                });
              } else if (user.userType === "admin") {
                res.send({
                  success: false,
                  error: user.name + ' is already an admin.',
                });
              } else {
                // Makes given user an admin
                user.userType = "admin";
                // Save changes in Mongo
                user.save((errSave) => {
                  if (errSave) {
                    res.send({
                      success: false,
                      error: errSave.message,
                    });
                  } else {
                    // If no error saving new user, returns successfully
                    res.send({
                      success: true,
                      error: '',
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });

  /**
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/new', (req, res) => {
    let userId = '';
    // Assign userId to user in backend
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // If user doesn't exist
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.',
      });
    } else {
      // Find the admin in Mongo
      User.findById(userId, (errAdmin, admin) => {
        // Error finding admin
        if (errAdmin) {
          res.send({
            success: false,
            error: errAdmin.message,
          });
        // Can't find admin
        } else if (!admin) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
          // Check if user is an admin
          if (admin.userType !== 'admin') {
            res.send({
              success: false,
              error: 'You must be an admin to post.'
            });
          } else {
            // finds given user in Mongo
            User.findOne({username: req.body.userToAdd}, (err, user) => {
              // Lets them know that if there is an error
              if (err) {
                res.send({
                  success: false,
                  error: err.message,
                });
              // Makes sure that user exists
              } else if (!user) {
                res.send({
                  success: false,
                  error: req.body.userToAdd + ' does not seem to exist!'
                });
              } else if (user.userType === "curator") {
                res.send({
                  success: false,
                  error: user.name + ' is already a curator.'
                });
              } else if (user.userType === "admin") {
                res.send({
                  success: false,
                  error: 'Cannot revoke admin privileges.'
                });
              } else {
                // Makes given user an admin
                user.userType = "curator";
                // Save changes in mongo
                user.save((errSave) => {
                  if (errSave) {
                    res.send({
                      success: false,
                      error: errSave.message,
                    });
                  } else {
                    // If no error saving new user, returns successfully
                    res.send({
                      success: true,
                      error: '',
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });

  /**
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/remove', (req, res) => {
    let userId = '';
    // Assign userId to user in backend
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // If user doesn't exist
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.',
      });
    } else {
      // Find the admin in Mongo
      User.findById(userId, (errAdmin, admin) => {
        // Error finding admin
        if (errAdmin) {
          res.send({
            success: false,
            error: errAdmin.message,
          });
        // Can't find admin
        } else if (!admin) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
          // Check if user is an admin
          if (admin.userType !== 'admin') {
            res.send({
              success: false,
              error: 'You must be an admin to post.'
            });
          } else {
            // finds given user in Mongo
            User.findOne({username: req.body.userToAdd}, (err, user) => {
              // Lets them know that if there is an error
              if (err) {
                res.send({
                  success: false,
                  error: err.message,
                });
              // Makes sure that user exists
              } else if (!user) {
                res.send({
                  success: false,
                  error: req.body.userToAdd + ' does not seem to exist!'
                });
              } else {
                // Revokes curator privileges, don't have power to revoke admin privilege though
                if (user.userType === "curator") {
                  user.userType = "user";
                  // Save changes in mongo
                  user.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: errSave.message,
                      });
                    } else {
                      // If no error saving new user, returns successfully
                      res.send({
                        success: true,
                        error: '',
                      });
                    }
                  });
                } else {
                  res.send({
                    success: false,
                    error: 'Cannot revoke admin privileges.',
                  });
                }
              }
            });
          }
        }
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
   * Pull all videos from the database
   */
  router.get('/videos', (req, res) => {
    // Pulls videos from mongo
    Video.find((err, videos) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: err.message,
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

    // Check if user is logged in
    let userId = "";
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Pull specific video from mongo
    Video.findById(id, (err, video) => {
      if (err) {
        res.send({
          success: false,
          error: err.message,
        });
      // If the video doesn't exist
      } else if (!video) {
        res.send({
          success: false,
          error: "Video not found",
        });
      // if no errors, return video
      } else {
        // Fetch author data
        User.findById(video.author, (er, author) => {
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
            // Default: users can't change videos
            let canModify = false;
            User.findById(userId, (errUser, user) => {
              if (user) {
                // Check if given user is either an admin or the curator of the video
                if (user.userType === 'admin' || user._id === video.author) {
                  canModify = true;
                }
              }
              // Send back data
              res.send({
                success: true,
                data: video,
                canModify,
              });
            });
          }
        });
      }
    });
  });

  /**
   * Route to handle deleting a specific video
   */
  router.delete('/videos/:id', (req, res) => {
    // Find the id from the video url
    const id = req.params.id;

    // Pull userId from the backend
    let userId = '';
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Find the given video in Mongo and delete it
    Video.findById(id, (errVideo, video) => {
      // Error finding video
      if (errVideo) {
        res.send({
          success: false,
          error: errVideo.message,
        });
      // Cannot find video
      } else if (!video) {
        res.send({
          success: false,
          error: 'No video found.',
        });
      } else {
        // Check to make sure user is logged in on backend
        if (!userId) {
          res.send({
            success: false,
            error: 'You must be logged in to delete videos.',
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
              // User found, check if user has privileges to delete a video (author or admin)
              if (user.userType === 'admin' || user._id === video.author) {
                // User CAN delete videos, remove from mongo
                video.remove((errRemove) => {
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
                // User CANNOT delete videos
                res.send({
                  success: false,
                  error: 'You do not have privileges to delete videos.'
                });
              }
            }
          });
        }
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
    let userId = '';
    // Assign userId to user in backend
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // If user doesn't exist
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.',
      });
    } else {
      // Find the poster in Mongo
      User.findById(userId, (errPost, poster) => {
        // Error finding admin
        if (errPost) {
          res.send({
            success: false,
            error: errPost.message,
          });
        // Can't find poster
        } else if (!poster) {
          res.send({
            success: false,
            error: 'User not found.'
          });
        } else {
            // Check if user is an admin
          if (poster.userType !== 'admin' && poster.userType !== 'curator') {
            res.send({
              success: false,
              error: 'You must be an admin or curator to post.'
            });
          } else {
            // Isolate variables
            const title = req.body.title;
            const url = req.body.url;
            const description = req.body.description;
            const location = req.body.location;

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
                author: userId,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
                location,
              });

            // Save the new video in Mongo
              newVideo.save((errVideo, video) => {
                if (errVideo) {
                  // If there was an error saving the video
                  res.send({
                    success: false,
                    error: errVideo.message,
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
          }
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
          error: err.message,
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
    // Isolate userId from backend
    let userId = "";
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    if (!userId) {
      res.send({
        success: false,
        error: 'Must be logged in.'
      });
    // Check to make sure user is accessing their own data
    } else if (userId !== req.query.userId) {
      res.send({
        success: false,
        error: 'You may only access your own information.'
      });
    } else {
      // Find user in Mongo
      User.findById(userId, (err, user) => {
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
          error: err.message,
        });
      } else {
        // Add a timestamp field for sorting
        articles.forEach((article) => {
          article.createdAt = article._id.getTimestamp();
          // TODO Don't save in mongo
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
   */
  router.post('/articles/new', (req, res) => {
    // Isolate userId from Backend
    let userId = "";
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Begin error checking
    if (!userId) {
      res.send({
        success: false,
        error: 'You must be logged in to post.'
      });
    } else if (userId !== req.body.userId) {
      res.send({
        success: false,
        error: 'Incorrect user.'
      });
    } else {
      User.findById(userId, (errUser, user) => {
        if (errUser) {
          res.send({
            success: false,
            error: errUser,
          });
        } else {
          if (user.userType !== 'admin' && user.userType !== 'curator') {
            res.send({
              success: false,
              error: 'General users cannot create articles.',
            });
          } else {
            // Isolate variables
            const title = req.body.title;
            const subtitle = req.body.subtitle;
            const image = req.body.image;
            const body = req.body.body;
            const location = req.body.location;

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
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime(),
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
  router.delete('/articles/:id', (req, res) => {
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

  /**
   * Route to handle pulling the information for a specific listing
   */
  router.get('/listings/:id', (req, res) => {
    // Find the id from the listing url
    const id = req.params.id;

    // Check if user is logged in
    let userId = "";
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Pull specific listing from mongo
    Listing.findById(id, (err, listing) => {
      if (err) {
        res.send({
          success: false,
          error: err.message,
        });
      // If the listing doesn't exist
      } else if (!listing) {
        res.send({
          success: false,
          error: "Article not found",
        });
      // if no errors, returns article along with the date it was created
      } else {
        // Fetch author data
        User.findById(listing.author, (er, author) => {
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
            // Default: users can't change listing
            let canModify = false;
            User.findById(userId, (errUser, user) => {
              if (user) {
                // Check if given user is either an admin or the curator of the listing
                if (user.userType === 'admin' || user._id === listing.author) {
                  canModify = true;
                }
              }
              // Make a new copy of the reviews
              const reviews = listing.reviews.slice();
              let reviewError = false;
              // Go through each review and change the author data being passed to frontend
              reviews.forEach((review) => {
                // Find author in Mongo
                User.findById(review.authorId, (errAuthor, revAuthor) => {
                  // Error finding author
                  if (err) {
                    reviewError = err;
                    return;
                  // Author can't be found
                  } else if (!revAuthor) {
                    reviewError = "Cannot find review author.";
                    return;
                  }
                  // Successfully found author, update so review contains author's name
                  review.author = revAuthor;
                  // Remove private information about author
                  review.author.password = "";
                });
              });
              // Check for error with reviews
              if (reviewError) {
                res.send({
                  success: false,
                  error: reviewError,
                });
              } else {
                // Update the reviews
                listing.reviews = reviews;

                // Send back data
                res.send({
                  success: true,
                  data: listing,
                  timestamp: listing._id.getTimestamp(),
                  canModify,
                });
              }
            });
          }
        });
      }
    });
  });

  /**
   * Route to handle deleting a specific listing
   */
  router.delete('/listings/:id', (req, res) => {
    // Find the id from the listing url
    const id = req.params.id;

    // Pull userId from the backend
    let userId = '';
    if (req.session.passport) {
      userId = req.session.passport.user;
    }

    // Find the given listing in Mongo and delete it
    Listing.findById(id, (errListing, listing) => {
      // Error finding listing
      if (errListing) {
        res.send({
          success: false,
          error: errListing.message,
        });
      // Cannot find listing
      } else if (!listing) {
        res.send({
          success: false,
          error: 'No listing found.',
        });
      } else {
        // Check to make sure user is logged in on backend
        if (!userId) {
          res.send({
            success: false,
            error: 'You must be logged in to delete listings.',
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
              // User found, check if user has privileges to delete a listing (author or admin)
              if (user.userType === 'admin' || user._id === listing.author) {
                // User CAN delete listing, remove from mongo
                listing.remove((errRemove) => {
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
                // User CANNOT delete listing
                res.send({
                  success: false,
                  error: 'You do not have privileges to delete listings.'
                });
              }
            }
          });
        }
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
    let userId = '';
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    // User is not logged in, cannot post
    if (!userId) {
      res.send({
        success: false,
        error: 'You must be logged in to post.'
      });
    } else {
      // Ensure poster is an admin or curator
      User.findById(userId, (errUser, user) => {
        if (errUser) {
          res.send({
            success: false,
            error: errUser,
          });
        } else if (!user) {
          res.send({
            success: false,
            error: 'Cannot find user',
          });
        } else {
          // Check if user is authorized to post
          if (user.userType !== 'admin' && user.userType !== 'curator') {
            res.send({
              success: false,
              error: 'General users cannot post new listings',
            });
          } else {
            // Isolate variables from the body
            const title = req.body.title;
            const description = req.body.description;
            const image = req.body.image;
            const hours = req.body.hours;
            const rating = req.body.rating;
            const price = req.body.price;
            const website = req.body.website;
            const amenities = req.body.amenities;
            const location = req.body.location;

            let error = "";

            // Error checking
            // TODO: error check for hours and amenities
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
            } else if (!location.name) {
              error = "Location must be populated.";
            } else if (!location.lat || !location.lng) {
              error = "Location must be valid.";
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
                location,
                author: userId,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
              });

              // Save the new article in mongo
              newListing.save((er, listing) => {
                if (er) {
                  // Pass on any error to the user
                  res.send({
                    success: false,
                    error: er.message,
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
          }
        }
      });
    }
  });

  /**
   * Route to add a new review
   * TODO error checking
   * @param userId
   * @param listingId
   * @param rating
   * @param title
   * @param content
   */
  router.post('/reviews/new', (req, res) => {
    let userId = '';
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    if (!userId) {
      res.send({
        success: false,
        error: 'You must be logged in to leave reviews.'
      });
    // Backend user and frontend user do not match
    } else if (userId !== req.body.userId) {
      res.send({
        success: false,
        error: 'You cannot post as another user.',
      });
    } else
    // Ensure all fields are populated before leaving review
    if (!req.body.rating || !req.body.title || !req.body.content) {
      res.send({
        success: false,
        error: 'All fields must be populated.'
      });
    } else {
      // If user is logged in, first find author in MongoDB
      User.findById(req.body.userId, (errUser, user) => {
        // Error finding user
        if (errUser) {
          res.send({
            success: false,
            error: 'Error finding user' + errUser.message,
          });
        } else

        // If user doesn't exist
        if (!user) {
          res.send({
            success: false,
            error: 'User does not exist.'
          });
        } else {
          // TODO Will eventually also want to store reviews in user model
          // TODO Update to be by id instead of name
          // If no errors can now save new reviews
          // First find given listing
          Listing.findById(req.body.listingId, (errListing, listing) => {
            // Error finding listing
            if (errListing) {
              res.send({
                success: false,
                error: errListing.message,
              });
            } else

            // Listing doesn't exist for some reason
            if (!listing) {
              res.send({
                success: false,
                error: 'Cannot find listing.',
              });
            } else {
              // If listing has been found, update it with review
              const currentReviews = listing.reviews;

              // Check if user has already left a review
              let leftReviewAlready = false;
              currentReviews.forEach((review) => {
                if (review.authorId === user._id) {
                  leftReviewAlready = true;
                }
              });

              // If already left a review send back error
              if (leftReviewAlready) {
                res.send({
                  success: false,
                  error: "Users may only leave one review."
                });
              } else {
                // Add new review to array of current reviews
                currentReviews.push({
                  rating: req.body.rating,
                  title: req.body.title,
                  content: req.body.content,
                  createdAt: new Date().getTime(),
                  authorId: userId,
                });

                // Update listing with new review
                listing.reviews = currentReviews;

                // Resave listing in Mongo
                listing.save((er) => {
                  // Error saving listing
                  if (er) {
                    res.send({
                      success: false,
                      error: 'Error saving review' + er.message,
                    });
                  } else {
                    // Finally, if review is saved successfully
                    res.send({
                      success: true,
                      error: '',
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

  /**
   * Update a user's name
   * TODO: Error check and ensure full name was entered
   */
  router.post('/users/name', (req, res) => {
    // Isolate variables from the request
    const name = req.body.name;
    const userId = req.body.userId;
    let userIdBackend = "";
    if (req.session.passport) {
      userIdBackend = req.session.passport.user;
    }
    // User is not logged in
    if (!userIdBackend) {
      res.send({
        success: false,
        error: 'You must be logged in to change your name.'
      });
    // Frontend and backend userId do not match
    } else if (userId !== userIdBackend) {
      res.send({
        success: false,
        error: 'You may only change your own name.'
      });
    } else
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
            error: err.message,
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
          user.save((errUser) => {
            // Error saving user
            if (errUser) {
              res.send({
                success: false,
                error: errUser.message,
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
    let userIdBackend = "";
    if (req.session.passport) {
      userIdBackend = req.session.passport.user;
    }
    // User is not logged in
    if (!userIdBackend) {
      res.send({
        success: false,
        error: 'You must be logged in to change a bio.'
      });
      // User id on backend and frontend do not match
    } else if (userIdBackend !== userId) {
      res.send({
        success: false,
        error: 'You may only change your own bio.',
      });
    } else
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
            error: err.message,
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
          user.save((errUser) => {
            // Error saving user
            if (errUser) {
              res.send({
                success: false,
                error: errUser.message,
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
   * Update a user's profile picture
   * @param userId
   * @param profilePicture
   * TODO: Error check and ensure full name was entered
   */
  router.post('/users/profilePicture', (req, res) => {
    // Isolate variables
    let userIdBackend = "";
    const userId = req.body.userId;
    const profilePicture = req.body.profilePicture;

    if (req.session.passport) {
      userIdBackend = req.session.passport.user;
    }
    // User is not logged in on backend
    if (!userIdBackend) {
      res.send({
        success: false,
        error: 'Must be logged in to change profile picture.',
      });
    // Backend user doesn't match frontend user
    } else if (userIdBackend !== userId) {
      res.send({
        success: false,
        error: 'Can only change your own profile picture.',
      });
      // find and update given user
    } else {
      User.findById(userId, (err, user) => {
        if (err) {
          // Error finding user
          res.send({
            success: false,
            error: err.message,
          });
        } else if (!user) {
          res.send({
            success: false,
            error: 'User cannot be found.',
          });
        } else {
          // Update the user
          user.profilePicture = profilePicture;
          // Save the changes
          user.save((errSave) => {
            if (err) {
              res.send({
                success: false,
                error: errSave.message,
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

  /**
   * Find a given user's profile
   * TODO error checking
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
          error: err.message,
        });
      } else if (!user) {
        // User doesn't exist in mongo
        res.send({
          success: false,
          error: 'User does not exist.'
        });
      // Otherwise render user data
      } else {
        Article.find({author: id}, (errArticles, articles) => {
          // Error checking
          if (errArticles) {
            res.send({
              success: false,
              error: errArticles.message,
            });
          } else {
            Listing.find({author: id}, (errListings, listings) => {
              if (errListings) {
                res.send({
                  success: false,
                  error: errListings.message,
                });
              } else {
                Video.find({author: id}, (errVideo, videos) => {
                  if (errVideo) {
                    res.send({
                      success: false,
                      error: errVideo,
                    });
                  } else {
                    // Remove private data before sending back
                    user.password = "";
                    res.send({
                      success: true,
                      error: '',
                      data: user,
                      articles,
                      listings,
                      videos,
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

  // Route to send an email to Nalda team
  // TODO: implement
  router.post('/contact', (req, res) => {
    res.send({
      success: false,
      error: 'This feature has not been connected yet.'
    });
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
    //     // return error;
    //     res.send({
    //       error: 'Error sending message' + error
    //     });
    //   } else {
    //     res.send({
    //       data: 'lol it worked',
    //     });
    //   }
    //   // Preview only available when sending through an Ethereal account
    //
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // });
  });
  // Return the router for use throughout the application
  return router;
};
