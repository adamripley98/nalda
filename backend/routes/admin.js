/**
 * Handles all backend routes for admin related privileges
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const async = require('async');

// Import database models
const User = require('../models/user');
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');

// Import helper methods
const {AdminCheck} = require('../helperMethods/authChecking');

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
            returnContent.push({
              contentType: component.contentType,
              contentId: cont.contentId,
              title: content.title,
            });
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

// Export the following methods for routing
module.exports = () => {
  // Route to get admin information
  router.get('/admin', (req, res) => {
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Declare arrays of data that will be passed back
        const curators = [];
        const admins = [];
        const users = [];

        // Find content
        Article.find({}, (errArticles, articles) => {
          Listing.find({}, (errListings, listings) => {
            Video.find({}, (errVideos, videos) => {
              Homepage.find({}, (errHomepage, homepageContent) => {
                // Send back any errors
                if (errArticles || errListings || errVideos || errHomepage) {
                  res.send({
                    success: false,
                    error: 'Error finding content.',
                  });
                } else {
                  const articleInfo = [];
                  const listingInfo = [];
                  const videoInfo = [];
                  articles.forEach(art => {
                    articleInfo.push({
                      _id: art._id,
                      title: art.title,
                    });
                  });
                  listings.forEach(list => {
                    listingInfo.push({
                      _id: list._id,
                      title: list.title,
                    });
                  });
                  videos.forEach(vid => {
                    videoInfo.push({
                      _id: vid._id,
                      title: vid.title,
                    });
                  });
                  // Find all curators and admins
                  User.find({}, (err, profiles) => {
                    if (err) {
                      res.send({
                        success: false,
                        error: 'Error finding content.',
                      });
                    } else {
                      const userData = {
                        totalUsers: 0,
                        weeklyRegisters: 0,
                      };

                      // Display pertinent information
                      profiles.forEach((user) => {
                        if (user.userType === 'curator') {
                          curators.push({name: user.name, username: user.username, userId: user._id});
                        } else if (user.userType === 'admin') {
                          admins.push({name: user.name, username: user.username, userId: user._id});
                        } else if (user.userType === 'user') {
                          users.push({name: user.name, username: user.username, userId: user._id});
                          // Increment total users
                          userData.totalUsers++;
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          // Count number of users who registered this week
                          if (user._id.getTimestamp().getTime() > weekAgo.getTime()) {
                            userData.weeklyRegisters++;
                          }
                        }
                      });
                      const homepage = homepageContent[0];
                      pullData(homepage.components, (resp) => {
                        if (!resp.success) {
                          res.send({
                            success: false,
                            error: resp.error,
                          });
                        } else {
                          homepage.components = resp.returnComponents;
                          homepage.save((errSave) => {
                            if (errSave) {
                              res.send({
                                success: false,
                                error: 'Error getting admin data.',
                              });
                            } else {
                              const home = {
                                banner: homepage.banner,
                                components: homepage.components,
                              };
                              // Send back information
                              res.send({
                                success: true,
                                error: '',
                                data: {
                                  curators,
                                  admins,
                                  users,
                                  homepageContent: home,
                                  userData,
                                  articles: articleInfo,
                                  listings: listingInfo,
                                  videos: videoInfo,
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
        });
      }
    });
  });
  // /**
  //  * Route to pull data to admin panel
  //  */
  // router.get('/admin', (req, res) => {
  //   // Helper function to pull data for each of the different content types
  //   const pullData = (arr, callback) => {
  //     // Array of content to be returned
  //     const returnArr = [];
  //
  //     // Loop through array and pull pertinent data
  //     async.eachSeries(arr, (item, cb) => {
  //       // Find the model for pulling data based on the content type
  //       let Model = null;
  //       if (item.contentType === 'article') {
  //         Model = Article;
  //       } else if (item.contentType === 'listing') {
  //         Model = Listing;
  //       } else {
  //         Model = Video;
  //       }
  //
  //       // Find given content
  //       Model.findById(item.contentId, (errContent, content) => {
  //         if (errContent) {
  //           callback({
  //             success: false,
  //             error: 'There was an error fetching homepage content',
  //           });
  //         } else if (content) {
  //           const newContent = {
  //             contentType: item.contentType,
  //             contentId: item.contentId,
  //             title: content.title,
  //           };
  //           // Add the new content to the array and continue looping
  //           returnArr.push(newContent);
  //           cb();
  //         }
  //       });
  //     }, (asyncErr) => {
  //       if (asyncErr) {
  //         res.send({
  //           success: false,
  //           error: 'Error loading admin panel.',
  //         });
  //       } else {
  //         callback({
  //           success: true,
  //           error: '',
  //           returnArr,
  //         });
  //         return;
  //       }
  //     });
  //   };
  //
  //   // Check to make sure admin is logged in
  //   AdminCheck(req, (authRes) => {
  //     // Return any authentication errors
  //     if (!authRes.success) {
  //       res.send({
  //         success: false,
  //         error: authRes.error,
  //       });
  //     } else {
  //       // Declare arrays of data that will be passed back
  //       const curators = [];
  //       const admins = [];
  //       const users = [];
  //
  //       // Find content
  //       Article.find({}, (errArticles, articles) => {
  //         Listing.find({}, (errListings, listings) => {
  //           Video.find({}, (errVideos, videos) => {
  //             Homepage.find({}, (errHomepage, homepageContent) => {
  //               // Send back any errors
  //               if (errArticles || errListings || errVideos || errHomepage) {
  //                 res.send({
  //                   success: false,
  //                   error: 'Error finding content.',
  //                 });
  //               } else {
  //                 // Find all curators and admins
  //                 User.find({}, (err, profiles) => {
  //                   if (err) {
  //                     res.send({
  //                       success: false,
  //                       error: 'Error finding content.',
  //                     });
  //                   } else {
  //                     const userData = {
  //                       totalUsers: 0,
  //                       weeklyRegisters: 0,
  //                     };
  //
  //                     // Display pertinent information
  //                     profiles.forEach((user) => {
  //                       if (user.userType === 'curator') {
  //                         curators.push({name: user.name, username: user.username, userId: user._id});
  //                       } else if (user.userType === 'admin') {
  //                         admins.push({name: user.name, username: user.username, userId: user._id});
  //                       } else if (user.userType === 'user') {
  //                         users.push({name: user.name, username: user.username, userId: user._id});
  //                         // Increment total users
  //                         userData.totalUsers++;
  //                         const weekAgo = new Date();
  //                         weekAgo.setDate(weekAgo.getDate() - 7);
  //                         // Count number of users who registered this week
  //                         if (user._id.getTimestamp().getTime() > weekAgo.getTime()) {
  //                           userData.weeklyRegisters++;
  //                         }
  //                       }
  //                     });
  //                     const homepage = homepageContent[0];
  //                     pullData(homepage.fromTheEditors, (editorsResp) => {
  //                       if (!editorsResp.success) {
  //                         res.send({
  //                           success: false,
  //                           error: editorsResp.error,
  //                         });
  //                       } else {
  //                         const fromTheEditors = editorsResp.returnArr;
  //                         pullData(homepage.naldaVideos, (videosResp) => {
  //                           if (!videosResp.success) {
  //                             res.send({
  //                               success: false,
  //                               error: videosResp.error,
  //                             });
  //                           } else {
  //                             const naldaVideos = videosResp.returnArr;
  //                             pullData(homepage.recommended, (recResp) => {
  //                               if (!recResp.success) {
  //                                 res.send({
  //                                   success: false,
  //                                   error: recResp.error,
  //                                 });
  //                               } else {
  //                                 const recommended = recResp.returnArr;
  //                                 const home = {
  //                                   banner: homepage.banner,
  //                                   naldaVideos,
  //                                   fromTheEditors,
  //                                   recommended,
  //                                   categories: homepage.categories,
  //                                 };
  //                                 // Send back information
  //                                 res.send({
  //                                   success: true,
  //                                   error: '',
  //                                   data: {
  //                                     curators,
  //                                     admins,
  //                                     users,
  //                                     homepageContent: home,
  //                                     userData,
  //                                     articles,
  //                                     listings,
  //                                     videos,
  //                                   }
  //                                 });
  //                               }
  //                             });
  //                           }
  //                         });
  //                       }
  //                     });
  //                   }
  //                 });
  //               }
  //             });
  //           });
  //         });
  //       });
  //     }
  //   });
  // });

  /**
   * Route to handle adding new admins
   * Admins are allowed to add more admins/curators and create content
   */
  router.post('/admin/new', (req, res) => {
    // Check to make sure poster is an admin
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // If user is an admin, finds given user to add in Mongo
        User.findOne({username: req.body.userToAdd}, (err, user) => {
          // Lets them know that if there is an error
          if (err) {
            res.send({
              success: false,
              error: 'Error adding admin.',
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
                  error: "Error saving admin.",
                });
              } else {
                // Create new admin to pass back
                const newAdmin = {
                  name: user.name,
                  username: user.username,
                  userId: user._id,
                };
                // If no error saving new user, returns successfully
                res.send({
                  success: true,
                  data: {
                    newAdmin,
                  },
                  error: '',
                });
              }
            });
          }
        });
      }
    });
  });

  /**
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/new', (req, res) => {
    // Check to make sure poster is an admin
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // If user is an admin, finds given user in Mongo
        User.findOne({username: req.body.userToAdd}, (err, user) => {
          // Lets them know that if there is an error
          if (err) {
            res.send({
              success: false,
              error: "Error adding curator.",
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
                  error: "Error saving curator.",
                });
              } else {
                // Create new admin to pass back
                const newCurator = {
                  name: user.name,
                  username: user.username,
                  userId: user._id,
                };
                // If no error saving new user, returns successfully
                res.send({
                  success: true,
                  error: '',
                  data: {
                    newCurator,
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
   * Route to handle adding new curators who are allowed to create content but not add others
   * @param userToAdd
   */
  router.post('/curator/remove', (req, res) => {
    // Check to make sure poster is an admin
    AdminCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // finds given user in Mongo
        User.findOne({username: req.body.userToAdd}, (err, user) => {
          // Lets them know that if there is an error
          if (err) {
            res.send({
              success: false,
              error: "Error finding content",
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
                    error: 'Error saving curator.',
                  });
                } else {
                  const removedCurator = {
                    name: user.name,
                    username: user.username,
                    userId: user._id,
                  };
                  // If no error saving new user, returns successfully
                  res.send({
                    success: true,
                    error: '',
                    data: {
                      removedCurator,
                    },
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
    });
  });

  return router;
};
