// Import models
const User = require('../models/user');

// Helper method to check if a user is an admin or a curator
const notCuratorOrAdmin = (req) => {
  // Isolate userId from Backend
  let userId = "";
  if (req.session.passport) {
    userId = req.session.passport.user;
  }

  // No user is logged in
  if (!userId) {
    return 'You must be logged in to post.';
  }

  // Search for user in Mongo
  User.findById(userId, (errUser, user) => {
    // If error finding user
    if (errUser) {
      return errUser.message;
    // User isn't admin or curator
    } else if (user.userType !== 'admin' && user.userType !== 'curator') {
      return 'General users cannot create articles.';
    }
    // Return no error
    return false;
  });
};

const notAdmin = (req) => {
  let userId = '';
  // Assign userId to user in backend
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  // If user doesn't exist
  if (!userId) {
    return 'Must be logged in';
  }
  // Find the admin in Mongo
  User.findById(userId, (errAdmin, admin) => {
    // Error finding admin
    if (errAdmin) {
      return errAdmin.message;
    // Can't find admin
    } else if (!admin) {
      return 'User not found.';
    // User isn't am admin
    } else if (admin.userType !== 'admin') {
      return 'You must be an admin.';
    }
    // If no errors
    return false;
  });
};

const notLoggedIn = (req) => {
  // Isolate userId from backend
  let userId = "";
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  // User is not logged in
  if (!userId) {
    return 'Must be logged in.';
  }
  // User is logged in
  return false;
};

module.exports = {
  notCuratorOrAdmin,
  notAdmin,
  notLoggedIn,
};
