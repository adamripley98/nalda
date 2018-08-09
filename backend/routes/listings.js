/**
 * Handles all backend routes for listings
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');

// Import database models
const Listing = require('../models/listing');
const User = require('../models/user');
const Homepage = require('../models/homepage');

// Import helper methods
const {CuratorOrAdminCheck} = require('../helperMethods/authChecking');
const {ResizeAndUploadImage, DeleteImages} = require('../helperMethods/imageProcessing');

// Export the following methods for routing
module.exports = () => {
/**
 * Pull all listings from the database
 */
  router.get('/', (req, res) => {
    // Pulls articles from mongo
    Listing.find({})
    .then(listings => {
      // Send listings back in correct order
      listings.reverse();
      // If everything went as planned
      res.send({listings});
    })
    .catch(() => {
      res.status(404).send({error: 'Error finding listings.'});
    });
  });

  /**
   * Route to handle pulling the information for a specific listing
   */
  router.get('/:id', (req, res) => {
    // Find the id from the listing url
    const id = req.params.id;

    // Check if user is logged in
    const userId = req.session.passport ? req.session.passport.user : null;

    Listing.findById(id)
    .then(listing => {
      if (!listing) {
        res.status(404).send({error: 'Error pulling listing.'});
        return;
      }
      User.findById(listing.author)
      .then(author => {
        if (!author) {
          res.status(404).send({error: 'Error pulling listing.'});
          return;
        }
        // Default: users can't change listing
        let canModify = false;
        User.findById(userId)
        .then(user => {
          if (user) {
            // Check if given user is either an admin or the curator of the listing
            if (user.userType === 'admin' || user.userType === 'curator') {
              canModify = true;
            }
          }
          // Go through each review and change the author data being passed to frontend
          const reviews = [];
          let reviewError = "";
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
            User.findById(review.authorId)
            .then(revAuthor => {
              if (!revAuthor) {
                reviewError = 'Cannot find author.';
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
            })
            .catch(() => {
              reviewError = 'Cannot find author.';
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
        })
        .catch(() => {
          res.status(404).send({error: 'Error pulling listing.'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error pulling listing.'});
        return;
      });
    })
    .catch(() => {
      res.status(404).send({error: 'Error pulling listing.'});
      return;
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
  router.post('/:id/edit', (req, res) => {
    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
        // Auth error
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate variables
      const userId = req.session.passport.user;
      const listingId = req.params.id;
      const { title, image, images, location, rating, description, amenities, additionalAmenities, naldaFavorite, categories, price, website, hours } = req.body;

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
        res.status(404).send({error});
        return;
      }
      let mainImg = image;
      let previewImg = image;
      // If initial image is new, upload to s3
      const awaitMainImageUpload = new Promise(resolve => {
        if (image.indexOf('s3.amazonaws') === -1) {
          ResizeAndUploadImage(image, 'listingpictures', 1920, title, (resp1) => {
            if (resp1.error) {
              resolve(res.status(404).send({error: resp1.error}));
              return;
            }
            // Make a preview version for performance
            ResizeAndUploadImage(image, 'listingpictures', 600, title, (resp2) => {
              if (resp2.error) {
                resolve(res.status(404).send({error: resp2.error}));
                return;
              }
              // For scope reasons
              mainImg = resp1.resizedImg;
              previewImg = resp2.resizedImg;
              resolve();
            });
          });
        } else {
          // If initial image has already been uploaded, simply move on
          resolve();
        }
      });
      // Now loop through the other images
      awaitMainImageUpload.then(() => {
        const newImages = [];
        async.eachSeries(images, (img, cb) => {
          // New image is actually new
          if (img.indexOf('s3.amazonaws') === -1) {
            ResizeAndUploadImage(img, 'listingpictures', 800, title, (resp3) => {
              if (resp3.error) {
                res.status(404).send({error: resp3.error});
                return;
              }
              newImages.push(resp3.resizedImg);
              cb();
            });
          } else {
            // new image has already been uploaded
            newImages.push(img);
            cb();
          }
        }, (asyncErr) => {
          if (asyncErr) {
            res.status(400).send({error: 'Error editting.'});
            return;
          }
          // Find the author
          User.findById(userId)
          .then(author => {
            if (!author) {
              res.status(404).send({error: 'Error editting listing'});
              return;
            }
            Listing.findById(listingId)
            .then(listing => {
              // Make changes to given listing
              listing.title = title;
              listing.description = description;
              listing.naldaFavorite = naldaFavorite;
              listing.image = mainImg;
              listing.imagePreview = previewImg;
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
              listing.save()
              .then(() => {
                res.send({listing});
                return;
              })
              .catch(() => {
                res.status(404).send({error: 'Error editting listing'});
                return;
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error editting listing'});
              return;
            });
          })
          .catch(() => {
            res.status(404).send({error: 'Error editting listing'});
            return;
          });
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error editting listing'});
        return;
      });
    });
  });

/**
 * Route to handle deleting a specific listing
 */
  router.delete('/:id', (req, res) => {
    // Find the id from the listing url
    const listingId = req.params.id;

    // Check to make sure user is an admin or the author
    CuratorOrAdminCheck(req, (authRes) => {
        // Auth error
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      Listing.findById(listingId)
      .then(listing => {
        listing.remove()
        .then(() => {
          Homepage.find({})
          .then(homepage => {
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
            home.save()
            .then(() => {
              // Delete images from AWS
              DeleteImages('listingpictures', listing.title, resp => {
                if (resp.error) {
                  res.status(400).send({error: resp.error});
                  return;
                }
                // No errors
                res.send({'error': ''});
                return;
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Error deleting listing.'});
              return;
            });
          })
          .catch(() => {
            res.status(404).send({error: 'Error deleting listing.'});
            return;
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Error deleting listing.'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error deleting listing.'});
        return;
      });
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
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate variables from the body
      const { title, description, naldaFavorite, image, images, hours, rating, price, website, categories, amenities, additionalAmenities, location } = req.body;
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
        res.status(400).send({error});
        return;
      }
      ResizeAndUploadImage(image, 'listingpictures', 1920, title, resp1 => {
        if (resp1.error) {
          res.status(404).send({error: resp1.error});
          return;
        }
        ResizeAndUploadImage(image, 'listingpictures', 600, title, resp2 => {
          if (resp2.error) {
            res.status(404).send({error: resp2.error});
            return;
          }
          const newImages = [];
          async.eachSeries(images, (img, cb) => {
            ResizeAndUploadImage(img, 'listingpictures', 800, title, resp3 => {
              if (resp3.error) {
                res.status(404).send({error: resp3.error});
                return;
              }
              newImages.push(resp3.resizedImg);
              cb();
            });
          }, (asyncErr) => {
            if (asyncErr) {
              res.status(400).send({error: 'Error posting listing.'});
              return;
            }
            // Creates a new listing with given params
            const newListing = new Listing({
              title,
              description,
              naldaFavorite,
              image: resp1.resizedImg,
              imagePreview: resp2.resizedImg,
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
            newListing.save()
            .then(listing => {
              // Send the data along if it was successfully stored
              res.send({listing});
            })
            .catch(() => {
              res.status(400).send({error: 'Error posting listing.'});
              return;
            });
          });
        });
      });
    });
  });

  // Route to filter by categories
  router.get('/categories/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;
    const filteredListings = [];
    Listing.find({})
    .then(listings => {
      // Loop through all listings to check if filters match
      async.eachSeries(listings, (listing, cb) => {
        const categories = listing.categories;
        if (categories[categoryName]) {
          filteredListings.push(listing);
        }
        cb();
      }, (asyncErr) => {
        if (asyncErr) {
          res.status(400).send({error: 'Error finding listings.'});
          return;
        }
        res.send({filteredListings});
        return;
      });
    })
    .catch(() => {
      res.status(400).send({error: 'Error finding listings.'});
    });
  });

  return router;
};
