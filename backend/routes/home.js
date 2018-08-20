/**
 * Handles all backend routes for homepage
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');

// Import database models
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');
const Event = require('../models/event');

// Import helper methods
const { AdminCheck } = require('../helperMethods/authChecking');
const { ResizeAndUploadImage } = require('../helperMethods/imageProcessing');

const getModel = (component) => {
  const contentType = component && component.contentType;

  if (!contentType) return undefined;

  if (contentType === 'Articles') {
    return Article;
  } else if (contentType === 'Listings') {
    return Listing;
  } else if (contentType === 'Videos') {
    return Video;
  } else if (contentType === 'Events') {
    return Event;
  }

  return undefined;
};

// Export the following methods for routing
module.exports = () => {
  // Helper function to pull data for each of the different content types
  const pullData = (components, callback) => {
    if (!callback) {
      throw Error('Callback undefined');
    }

    if (!components || !components.length) {
      callback({
        success: false,
        error: 'No components',
      });

      return;
    }

    // Array of content to be returned
    const returnComponents = [];

    // Loop through array and pull pertinent data
    async.eachSeries(components, (component, cb) => {
      // Find the model for pulling data based on the content type
      const Model = getModel(component);

      if (!Model) {
        callback({
          success: false,
          error: `Invalid component content type: ${component.contentType}`,
        });

        return;
      }

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

              return;
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
              } else if (component.contentType === 'Events') {
                newContent = {
                  contentType: component.contentType,
                  contentId: cont.contentId,
                  title: content.title,
                  description: content.description,
                  requirements: content.requirements,
                  location: content.location,
                  image: content.image,
                  startDate: content.startDate,
                  endDate: content.endDate,
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
        }, (contentAsyncErr) => {
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
    Homepage.find({})
      .then((home) => {
        const homepage = home[0];

        if (!homepage || !homepage.components || !homepage.components.length) {
          res.send({
            banner: homepage.banner,
            components: [],
          });

          return;
        }

        pullData(homepage.components, (resp) => {
          if (!resp.success) {
            res.status(404).send({
              error: resp.error || 'Something went wrong.',
            });

            return;
          }

          res.send({
            banner: homepage.banner,
            components: resp.returnComponents && resp.returnComponents.length ? resp.returnComponents : [],
          });

          return;
        });
      })
      .catch(() => {
        res.status(404).send({
          error: 'Cannot return homepage.',
        });
      });
  });

  /**
   * View a single homepage component
   */
  router.get('/components/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(404).send({
        error: 'Invalid homepage component ID.',
      });

      return;
    }

    // Find the homepage
    Homepage.findOne({})
    .then(home => {
      if (!home) {
        res.status(404).send({
          error: 'There was an issue pulling homepage data. Refresh the page and try again.',
        });

        return;
      }
      // Find the component with the correct ID
      let component = null;
      home.components.forEach(c => {
        // NOTE the ID must be cast to a string to check equality
        if (`${c._id}` === id) {
          component = c;
        }
      });

      // If we failed to find a component
      if (!component) {
        res.status(404).send({
          error: 'There is no component with the passed in ID. Check the URL and try again.',
        });

        return;
      }

      // Find the model for pulling data based on the content type
      let Model = null;
      if (component.contentType === 'Articles') {
        Model = Article;
      } else if (component.contentType === 'Listings') {
        Model = Listing;
      } else if (component.contentType === 'Videos') {
        Model = Video;
      }  else if (component.contentType === 'Events') {
        Model = Event;
      } else return;

      // Find all of the content associated with the component
      if (component.content && component.content.length) {
        const returnContent = [];
        async.forEach(component.content, (cont, contentCallback) => {
          Model.findById(cont.contentId)
          .then(content => {
            if (!content) {
              contentCallback();
            } else {
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
              } else if (component.contentType === 'Events') {
                newContent = {
                  contentType: component.contentType,
                  contentId: cont.contentId,
                  title: content.title,
                  description: content.description,
                  requirements: content.requirements,
                  location: content.location,
                  image: content.image,
                  startDate: content.startDate,
                  endDate: content.endDate,
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
            }
          })
          .catch(() => {
            res.status(404).send({
              error: 'Error fetching homepage content',
            });

            return;
          });
        }, contentAsyncErr => {
          if (contentAsyncErr) {
            res.status(404).send({error: 'Failed to pull content.'});
            return;
          }
          component.content = returnContent;

          // If a component was successfully found
          res.send({component});
          return;
        });
      } else {
        res.status(404).send({error: 'No content data was found.'});
        return;
      }
    })
    .catch(() => {
      res.status(404).send({error: 'There was an issue pulling homepage data. Refresh the page and try again.'});
      return;
    });
  });

  // Route to handle adding content to homepage banner
  router.post('/banner/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      // Isolate body params
      const contentId = req.body.bannerContentId;
      const contentImage = req.body.bannerImageToAdd;
      // Attempt to find content in listing or article
      Listing.findById(contentId)
      .then(listing => {
        Article.findById(contentId)
        .then(article => {
          Event.findById(contentId)
          .then(event => {
            let error = '';
            if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
              error = "No content with that id exists.";
              // Make sure content with given id exists
            } else if (!article && !listing && !event) {
              error = 'No article, event or listing with that ID exists.';
            }

            if (error) {
              res.status(404).send({error});
              return;
            }

            // Resize main article image
            ResizeAndUploadImage(contentImage, 'bannerpictures', 1920, null, (resp) => {
              if (resp.error) {
                res.status(404).send({error: resp.error});
                return;
              }
              // Find homepage
              Homepage.find({})
              .then(home => {
                // NOTE only to declare 1 time
                if (!home.length) {
                  // Create new homepage
                  const newHomepage = new Homepage({
                    banner: [],
                    naldaVideos: [],
                    categories: [],
                    recommended: [],
                    fromTheEditors: [],
                  });
                  // save new homepage in mongo
                  newHomepage.save()
                  .then(() => {
                    res.status(404).send({error: 'You just created the first instance of a homepage, try adding a banner again.'});
                    return;
                  })
                  .catch(() => {
                    res.status(404).send({error: 'Error on homepage.'});
                    return;
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
                    res.status(404).send({error: 'This content is already in the banner.'});
                    return;
                  }
                  // Create object to pass back, of type article or listing
                  const newBannerContent = {
                    contentType: article ? "article" : listing ? "listing" : "event",
                    contentId,
                    contentImage: resp.resizedImg,
                  };
                  // Add to banner
                  banner.push(newBannerContent);
                  homepage.banner = banner;
                  // Save new banner to mongo
                  homepage.save()
                  .then(() => {
                    // Send back success
                    res.send({banner: homepage.banner});
                    return;
                  })
                  .catch(() => {
                    res.status(404).send({error: 'Error saving image.'});
                    return;
                  });
                }
              })
              .catch(() => {
                res.status(404).send({error: 'Error finding homepage.'});
                return;
              });
            });
          })
          .catch(() => {
            res.status(404).send({error: 'Error finding content'});
            return;
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Error finding content'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error finding content'});
        return;
      });
    });
  });

  // Route to handle deleting an item from the banner
  router.post('/banner/remove/:bannerContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.bannerContentId;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      Homepage.find({})
      .then(home => {
        if (!home) {
          res.status(404).send({error: 'Error removing item'});
          return;
        }
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
        homepage.save()
        .then(() => {
          res.send({data: banner});
          return;
        })
        .catch(() => {
          res.status(404).send({error: 'Error removing content.'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Error retrieving homepage data.'});
        return;
      });
    });
  });

  // Route to add a new component to the homepage
  router.post('/component/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }

      const { title, subtitle, contentType } = req.body;
      if (!title || !subtitle || !contentType) {
        res.status(404).send({error: 'Form must be filled out completely.'});
        return;
      }

      const newComp = {
        title,
        subtitle,
        contentType,
        content: [],
      };

      // Find the homepage to add the content to
      Homepage.find({})
      .then(home => {
        // Select the first homepage
        const homepage = home[0];

        // Add this component to the homepage components
        const components = homepage.components.slice();
        components.push(newComp);
        homepage.components = components;

        // Save the new components to the homepage
        homepage.save()
        .then(() => {
          res.send({components});
          return;
        })
        .catch(() => {
          res.status(404).send({error: 'Failed to save to homepage'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Failed to save to homepage'});
        return;
      });
    });
  });

  // Route to delete a given component from homepage
  router.post('/component/remove', (req, res) => {
    const {componentId} = req.body;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      Homepage.find({})
      .then(home => {
        const homepage = home[0];
        const components = homepage.components.slice();
        let hasChanged = false;
        components.forEach((component, i) => {
          if (component._id.toString() === componentId) {
            const newComponents = homepage.components.slice();
            newComponents.splice(i, 1);
            homepage.components = newComponents;
            hasChanged = true;
          }
        });
        if (hasChanged) {
          homepage.save()
          .then(newHome => {
            res.send({components: newHome.components});
            return;
          })
          .catch(() => {
            res.status(404).send({error: 'Error removing component.'});
            return;
          });
        } else {
          res.staus(404).send({error: 'Error removing component.'});
          return;
        }
      })
      .catch(() => {
        res.status(404).send({error: 'Error removing component.'});
        return;
      });
    });
  });

  // Route to add content to an existing component
  router.post('/component/content/remove', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      const {contentId, componentId} = req.body;
      if (!contentId || !componentId) {
        res.status(404).send({error: 'Error removing content.'});
        return;
      }
      Homepage.find({})
      .then(home => {
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
          homepage.save()
          .then(newHome => {
            res.send({components: newHome.components});
            return;
          })
          .catch(() => {
            res.status(404).send({error: 'Error removing content.'});
            return;
          });
        } else {
          res.status(404).send({error: 'Error removing content.'});
          return;
        }
      })
      .catch(() => {
        res.status(404).send({error: 'Error removing content.'});
        return;
      });
    });
  });

  // Route to add content to an existing component
  router.post('/component/content/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.status(404).send({error: authRes.error});
        return;
      }
      const { component, contentId } = req.body;
      let newContentType = '';
      if (!contentId) {
        res.status(404).send({success: false});
        return;
      }
      Article.findById(contentId)
      .then(article => {
        Listing.findById(contentId)
        .then(listing => {
          Video.findById(contentId)
          .then(video => {
            Event.findById(contentId)
            .then(event => {
              if (!article && !listing && !video && !event) {
                res.status(404).send({error: 'No content found with given id found.'});
                return;
              }
              if (article) {
                newContentType = 'Articles';
              } else if (listing) {
                newContentType = 'Listings';
              } else if (video) {
                newContentType = 'Videos';
              } else if (event) {
                newContentType = 'Events';
              }

              Homepage.find({})
              .then(home => {
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
                  homepage.save()
                  .then(newHome => {
                    res.send({components: newHome.components});
                    return;
                  })
                  .catch(() => {
                    res.status(404).send({error: 'Cannot add content.'});
                    return;
                  });
                } else {
                  res.status(404).send({error: 'Cannot add content. Make sure it is the right type and is not repeat.'});
                  return;
                }
              })
              .catch(() => {
                res.status(404).send({error: 'Cannot add content.'});
                return;
              });
            })
            .catch(() => {
              res.status(404).send({error: 'Cannot add content.'});
              return;
            });
          })
          .catch(() => {
            res.status(404).send({error: 'Cannot add content.'});
            return;
          });
        })
        .catch(() => {
          res.status(404).send({error: 'Cannot add content.'});
          return;
        });
      })
      .catch(() => {
        res.status(404).send({error: 'Cannot add content.'});
        return;
      });
    });
  });

  return router;
};
