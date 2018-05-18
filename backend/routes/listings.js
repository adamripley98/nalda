/**
 * Handles all backend routes for listings
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');
const AWS = require('aws-sdk');
const uuid = require('uuid-v4');
const sharp = require('sharp');
const request = require('request').defaults({ encoding: null });

// Import database models
const Listing = require('../models/listing');
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
 * Pull all listings from the database
 */
  router.get('/', (req, res) => {
    // Pulls articles from mongo
    Listing.find((err, listings) => {
      if (err) {
        // If there was an error with the request
        res.send({
          success: false,
          error: 'Error finding listings.',
        });
      } else {
        // Send listings back in correct order
        listings.reverse();
        // If everything went as planned
        res.send({
          success: true,
          data: listings,
        });
      }
    });
  });

  /**
   * Route to handle pulling the information for a specific listing
   */
  router.get('/:id', (req, res) => {
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
        res.status(404).send({
          success: false,
          error: "Listing not found.",
        });
      } else if (!listing) {
        // If the listing doesn't exist
        res.status(404).send({
          success: false,
          error: "Listing not found.",
        });
      // if no errors, returns article along with the date it was created
      } else {
        // Fetch author data
        User.findById(listing.author, (er, author) => {
          if (er) {
            // Error finding author
            res.send({
              success: false,
              error: "Failed to find author.",
            });
          } else if (!author) {
            res.send({
              success: false,
              error: 'Failed to find author.',
            });
          } else {
            // Default: users can't change listing
            let canModify = false;
            User.findById(userId, (errUser, user) => {
              if (user) {
                // Check if given user is either an admin or the curator of the listing
                if (user.userType === 'admin' || user.userType === 'curator') {
                  canModify = true;
                }
              }
              // Make a new copy of the reviews
              // const reviews = listing.reviews.slice();
              let reviewError = "";

              // Go through each review and change the author data being passed to frontend
              const reviews = [];
              async.each(listing.reviews, (review, callback) => {
                // Copy the review object
                const newRev = {
                  _id: review._id,
                  authorId: review.authorId,
                  createdAt: review.createdAt,
                  content: review.content,
                  title: review.title,
                  rating: review.rating,
                  author: {
                    name: "",
                    _id: "",
                    profilePicture: "",
                  },
                  canChange: false,
                };

                // Find author in Mongo
                User.findById(review.authorId, (errAuthor, revAuthor) => {
                  // Error finding author
                  if (errAuthor) {
                    reviewError = 'Cannot find review author.';
                  // Author can't be found
                  } else if (!revAuthor) {
                    reviewError = "Cannot find review author.";
                  }

                  // Successfully found author, update so review contains author's name
                  newRev.author = {
                    name: revAuthor.name,
                    _id: revAuthor._id,
                    profilePicture: revAuthor.profilePicture,
                  };

                  // Check if user has review delete privileges: admin, listing author, or review author
                  if (canModify || userId === review.authorId) {
                    newRev.canChange = true;
                  }

                  // Return the review
                  reviews.push(newRev);
                  callback();
                });
              }, asyncErr => {
                if (asyncErr) {
                  res.send({
                    success: false,
                    error: 'Error getting content',
                  });
                } else {
                  // Check for error with reviews
                  if (reviewError) {
                    res.send({
                      success: false,
                      error: reviewError,
                    });
                  } else {
                    // Update the reviews
                    listing.reviews = null;
                    // Send back data
                    res.send({
                      author,
                      success: true,
                      data: listing,
                      reviews: reviews,
                      timestamp: listing._id.getTimestamp(),
                      canModify,
                    });
                  }
                }
              });
            });
          }
        });
      }
    });
  });

  /**
   * Route to handle editing a listing
   * @param title
   * @param description
   * @param image (url)
   * @param location
   * @param hours
   * @param rating
   * @param price
   * @param website
   * @param categories
   */
   // TODO find better solution than reusing entire code block lol
  router.post('/:id/edit', (req, res) => {
    // Find the id from the url
    const listingId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
        // Auth error
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate variables
        const title = req.body.title;
        const image = req.body.image;
        const images = req.body.images;
        const location = req.body.location;
        const rating = req.body.rating;
        const description = req.body.description;
        const amenities = req.body.amenities;
        const additionalAmenities = req.body.additionalAmenities;
        const naldaFavorite = req.body.naldaFavorite;
        const categories = req.body.categories;
        const price = req.body.price;
        const website = req.body.website;
        const hours = req.body.hours;
        const userId = req.session.passport.user;

        // Keep track of any errors
        let error = "";

        // Perform error checking on variables
        if (!title) {
          error = "Title must be populated.";
        } else if (!description) {
          error = "Description must be populated.";
        } else if (!naldaFavorite) {
          error = "Nalda's Favorite must be populated.";
        } else if (!image) {
          error = "Image must be populated.";
        } else if (!price) {
          error = "Price must be populated.";
        } else if (!hours) {
          error = "Hours must be populated.";
        } else if (amenities.length > 10) {
          error = "Only 10 amenities allowed.";
        } else if (Object.keys(location).length === 0) {
          error = "Location must be populated.";
        }

        // If there was an error or not
        if (error) {
          res.send({
            success: false,
            error,
          });
        } else {
          const newImages = [];
          const folderId = uuid();
          // If main image was a newly uploaded image
          if (image.indexOf('s3.amazonaws') === -1) {
            // Convert article picture to a form that s3 can display
            const imageConverted = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            // Resize image before storage
            sharp(imageConverted)
            .resize(1920, null)
            .toBuffer()
            .then(imageResized => {
              // Create bucket
              s3bucket.createBucket(() => {
                var params = {
                  Bucket: AWS_BUCKET_NAME,
                  Key: `listingpictures/${folderId}/${uuid()}`,
                  ContentType: 'image/jpeg',
                  Body: imageResized,
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
                    sharp(imageConverted)
                    .resize(600, null)
                    .toBuffer()
                    .then(resizedPrev => {
                      // Create bucket
                      s3bucket.createBucket(() => {
                        var previewParams = {
                          Bucket: AWS_BUCKET_NAME,
                          Key: `listingpictures/${folderId}/${uuid()}`,
                          ContentType: 'image/jpeg',
                          Body: resizedPrev,
                          ContentEncoding: 'base64',
                          ACL: 'public-read',
                        };
                        // Upload photo
                        s3bucket.upload(previewParams, (errorupload, prevData) => {
                          if (errorupload) {
                            res.send({
                              success: false,
                              error: 'Error uploading profile picture.',
                            });
                          } else {
                            async.eachSeries(images, (img, cb) => {
                              // New image is actually new
                              if (img.indexOf('s3.amazonaws') === -1) {
                                const listingPictureConverted = new Buffer(img.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                                sharp(listingPictureConverted)
                                .resize(800, null)
                                .toBuffer()
                                .then(listingPicResized => {
                                  s3bucket.createBucket(() => {
                                    var parameters = {
                                      Bucket: AWS_BUCKET_NAME,
                                      Key: `listingpictures/${folderId}/${uuid()}`,
                                      ContentType: 'image/jpeg',
                                      Body: listingPicResized,
                                      ContentEncoding: 'base64',
                                      ACL: 'public-read',
                                    };
                                    // Upload photo
                                    s3bucket.upload(parameters, (errorUpload, pic) => {
                                      if (errorUpload) {
                                        res.send({
                                          success: false,
                                          error: 'Error uploading profile picture.',
                                        });
                                      } else {
                                        newImages.push(pic.Location);
                                        cb();
                                      }
                                    });
                                  });
                                });
                              } else {
                                // new image is old
                                newImages.push(img);
                                cb();
                              }
                            }, (asyncErr) => {
                              if (asyncErr) {
                                res.send({
                                  success: false,
                                  error: 'Error editting.',
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
                                    // Find listing in Mongo
                                    Listing.findById(listingId, (listingErr, listing) => {
                                      if (listingErr) {
                                        res.send({
                                          success: false,
                                          error: 'Error editting.',
                                        });
                                      } else {
                                        // Make changes to given listing
                                        listing.title = title;
                                        listing.description = description;
                                        listing.naldaFavorite = naldaFavorite;
                                        listing.image = data.Location;
                                        listing.previewImage = prevData.Location;
                                        listing.images = newImages;
                                        listing.rating = rating;
                                        listing.price = price;
                                        listing.location = location;
                                        listing.categories = categories;
                                        listing.amenities = amenities;
                                        listing.additionalAmenities = additionalAmenities;
                                        listing.hours = hours;
                                        listing.website = website;
                                        listing.updatedAt = new Date().getTime();

                                        // Save changes in mongo
                                        listing.save((errSave) => {
                                          if (errSave) {
                                            res.send({
                                              success: false,
                                              error: 'Error saving listing.',
                                            });
                                          } else {
                                            res.send({
                                              success: true,
                                              error: '',
                                              data: listing,
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
            // Go to s3 and download image
            request.get(image, (reqErr, response, body) => {
              if(!reqErr && response.statusCode === 200) {
                // Convert downloaded image to a buffer
                const imageConverted = new Buffer(body, 'base64');
                // resize and reconvert to buffer
                sharp(imageConverted)
                .resize(1920, null)
                .toBuffer()
                .then( resized => {
                  var params = {
                    Bucket: AWS_BUCKET_NAME,
                    Key: `listingpictures/${title}/${uuid()}`,
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
                      async.eachSeries(images, (img, cb) => {
                        // If img is a new image
                        if (img.indexOf('s3.amazonaws') === -1) {
                          // Convert to storable form
                          const listingPictureConverted = new Buffer(img.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                          // Resize image
                          sharp(listingPictureConverted)
                          .resize(800, null)
                          .toBuffer()
                          .then(listingPicResized => {
                            s3bucket.createBucket(() => {
                              var parameters = {
                                Bucket: AWS_BUCKET_NAME,
                                Key: `listingpictures/${folderId}/${uuid()}`,
                                ContentType: 'image/jpeg',
                                Body: listingPicResized,
                                ContentEncoding: 'base64',
                                ACL: 'public-read',
                              };
                              // Upload photo
                              s3bucket.upload(parameters, (errorUpload, pic) => {
                                if (errorUpload) {
                                  res.send({
                                    success: false,
                                    error: 'Error uploading profile picture.',
                                  });
                                } else {
                                  newImages.push(pic.Location);
                                  cb();
                                }
                              });
                            });
                          });
                        } else {
                          // Simply add old image to new images array
                          newImages.push(img);
                          cb();
                        }
                      }, (asyncErr) => {
                        if (asyncErr) {
                          res.send({
                            success: false,
                            error: 'Error editting listing.',
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
                              // Find listing in Mongo
                              Listing.findById(listingId, (listingErr, listing) => {
                                if (listingErr) {
                                  res.send({
                                    success: false,
                                    error: 'Error editting listing.',
                                  });
                                } else {
                                  // Make changes to given listing
                                  listing.title = title;
                                  listing.description = description;
                                  listing.naldaFavorite = naldaFavorite;
                                  // TODO change back to image after done resizing
                                  listing.image = data.Location;
                                  listing.images = newImages;
                                  listing.rating = rating;
                                  listing.price = price;
                                  listing.location = location;
                                  listing.categories = categories;
                                  listing.amenities = amenities;
                                  listing.additionalAmenities = additionalAmenities;
                                  listing.hours = hours;
                                  listing.website = website;
                                  listing.updatedAt = new Date().getTime();

                                  // Save changes in mongo
                                  listing.save((errSave) => {
                                    if (errSave) {
                                      res.send({
                                        success: false,
                                        error: 'Error saving listing.',
                                      });
                                    } else {
                                      res.send({
                                        success: true,
                                        error: '',
                                        data: listing,
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
              }
            });
          }
        }
      }
    });
  });

/**
 * Route to handle deleting a specific listing
 */
 // TODO delete assets from AWS as well
  router.delete('/:id', (req, res) => {
    // Find the id from the listing url
    const listingId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
        // Auth error
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        Listing.findById(listingId, (errListing, listing) => {
          // User CAN delete listing, remove from mongo
          listing.remove((errRemove) => {
            if (errRemove) {
              res.send({
                success: false,
                error: 'Error deleting listing.',
              });
            // Send back success
            } else {
              Homepage.find({}, (errHome, homepage) => {
                if (errHome) {
                  res.send({
                    success: false,
                    error: 'Error deleting listing.',
                  });
                } else {
                  const home = homepage[0];
                  const banner = home.banner.slice();
                  // Remove content from banner
                  for (var j = 0; j < banner.length; j++) {
                    if (banner[j].contentId === listingId) {
                      banner.splice(j, 1);
                      break;
                    }
                  }
                  // Delete component from homepage
                  const components = home.components.slice();
                  components.forEach((comp, i) => {
                    comp.content.forEach((content, k) => {
                      if (content.contentId === listingId) {
                        components[i].content.splice(k, 1);
                      }
                    });
                  });
                  // Save changes
                  home.banner = banner;
                  home.components = components;

                  home.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: 'Error deleting listing.',
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
  router.post('/new', (req, res) => {
    // Check to make sure poster is an admin or curator
    CuratorOrAdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate variables from the body
        const { title, description, naldaFavorite, image, images, hours, rating,
                price, website, categories, amenities, additionalAmenities, location } = req.body;
        const userId  = req.session.passport.user;

        let error = "";

        // Error checking
        if (!title) {
          error = "Title must be populated.";
        } else if (!description) {
          error = "Description must be populated.";
        } else if (!naldaFavorite) {
          error = "Nalda's Favorite must be populated.";
        } else if (!image) {
          error = "Hero image must be populated.";
        } else if (images && images.length > 10) {
          error = "Maximum of 10 images.";
        } else if (!price) {
          error = "Price must be populated.";
        } else if (amenities.length > 10) {
          error = "Only 10 amenities allowed";
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
          const newImages = [];
          // Convert article picture to a form that s3 can display
          const imageConverted = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
          // Convert to appropriate size
          sharp(imageConverted)
          .resize(1920, null)
          .toBuffer()
          .then( resized => {
            var params = {
              Bucket: AWS_BUCKET_NAME,
              Key: `listingpictures/${title}/${uuid()}`,
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
                sharp(imageConverted)
                .resize(600, null)
                .toBuffer()
                .then( resizedPrev => {
                  // Create bucket
                  var previewParams = {
                    Bucket: AWS_BUCKET_NAME,
                    Key: `listingpictures/${title}/${uuid()}`,
                    ContentType: 'image/jpeg',
                    Body: resizedPrev,
                    ContentEncoding: 'base64',
                    ACL: 'public-read',
                  };
                  // Upload photo
                  s3bucket.upload(previewParams, (errupload, prevData) => {
                    if (errupload) {
                      res.send({
                        success: false,
                        error: 'Error uploading profile picture.',
                      });
                    } else {
                      async.eachSeries(images, (img, cb) => {
                        const listingPictureConverted = new Buffer(img.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                        // Resize listing pictures
                        sharp(listingPictureConverted)
                        .resize(800, null)
                        .toBuffer()
                        .then(listingPicResized => {
                          var parameters = {
                            Bucket: AWS_BUCKET_NAME,
                            Key: `listingpictures/${title}/${uuid()}`,
                            ContentType: 'image/jpeg',
                            Body: listingPicResized,
                            ContentEncoding: 'base64',
                            ACL: 'public-read',
                          };
                          // Upload photo
                          s3bucket.upload(parameters, (errorUpload, pic) => {
                            if (errorUpload) {
                              res.send({
                                success: false,
                                error: 'Error uploading profile picture.',
                              });
                            } else {
                              newImages.push(pic.Location);
                              cb();
                            }
                          });
                        });
                      }, (asyncErr) => {
                        if (asyncErr) {
                          res.send({
                            success: false,
                            error: 'Error posting listing.',
                          });
                        } else {
                          // Creates a new listing with given params
                          const newListing = new Listing({
                            title,
                            description,
                            naldaFavorite,
                            image: data.Location,
                            imagePreview: prevData.Location,
                            images: newImages,
                            hours,
                            rating,
                            price,
                            website,
                            categories,
                            amenities,
                            additionalAmenities,
                            location,
                            author: userId,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                          });

                          // Save the new article in mongo
                          newListing.save((er, listing) => {
                            if (er) {
                              // Pass on any error to the user
                              res.send({
                                success: false,
                                error: 'Error posting listing.',
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
                    }
                  });
                });
              }
            });
          });
        }
      }
    });
  });

  // Route to filter by categories
  router.get('/categories/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;
    const filteredListings = [];
    Listing.find({}, (errListing, listings) => {
      if (errListing) {
        res.send({
          success: false,
          error: 'Error finding listings.',
        });
      } else {
        // Loop through all listings to check if filters match
        async.eachSeries(listings, (listing, cb) => {
          const categories = listing.categories;
          if (categories[categoryName]) {
            filteredListings.push(listing);
          }
          cb();
        }, (asyncErr) => {
          if (asyncErr) {
            res.send({
              success: false,
              error: 'Error finding listings.',
            });
          } else {
            res.send({
              success: true,
              error: '',
              data: filteredListings,
            });
          }
        });
      }
    });
  });

  return router;
};
