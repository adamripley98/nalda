/**
 * Helper methods to ensure varying levels of authentication on the backend
 */

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
    return 'You must be logged in.';
  }

  // Search for user in Mongo
  User.findById(userId, (errUser, user) => {
    // If error finding user
    if (errUser) {
      return errUser.message;
    // User isn't admin or curator
    } else if (user.userType !== 'admin' && user.userType !== 'curator') {
      return 'General users do not have this privilege.';
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
    return 'Must be logged in.';
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

const AuthorOrAdminCheck = (req, docId, Document) => {
  // Pull userId from the backend
  let userId = '';
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  console.log('enteres authcheckign');
  // Find the given document in Mongo
  Document.findById(docId, (errDoc, doc) => {
    console.log('enters doc find');
    // Error finding document
    if (errDoc) {
      console.log('errdoc', errDoc);
      return {
        success: false,
        error: errDoc.message,
      };
    // Cannot find document
    } else if (!doc) {
      console.log('no doc');
      return {
        success: false,
        error: 'No document found.',
      };
    }
    console.log('ok');
    // Check to make sure user is logged in on backend
    if (!userId) {
      console.log('no userid');
      return {
        success: false,
        error: 'You must be logged in.',
      };
    }
    console.log('we here!');
    // Find user to check if they are author or admin
    User.findById(userId, (errUser, user) => {
      console.log('finding user');
      // Error finding user
      if (errUser) {
        return {
          success: false,
          error: errUser.message,
        };
      // Cannot find user
      } else if (!user) {
        return {
          success: false,
          error: 'You must be logged in.',
        };
      // User is not author or admin
      } else if (user.userType !== 'admin' && user._id !== doc.author) {
        return {
          success: false,
          error: 'You do not have the right privileges.',
        };
      }
      // User has privilege to do this, return document
      console.log('user should have priv');
      return {
        success: true,
        doc,
      };
    });
  });
};

module.exports = {
  notCuratorOrAdmin,
  notAdmin,
  notLoggedIn,
  AuthorOrAdminCheck,
};
