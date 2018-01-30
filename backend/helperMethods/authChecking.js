/**
 * Helper methods to ensure varying levels of authentication on the backend
 */

// Import models
const User = require('../models/user');

// Helper method to check if a user is an admin or a curator
const CuratorOrAdminCheck = (req, cb) => {
  // Isolate userId from Backend
  let userId = "";
  if (req.session.passport) {
    userId = req.session.passport.user;
  }

  // No user is logged in
  if (!userId) {
    cb({
      success: false,
      error: 'You must be logged in.',
    });
    return;
  }

  // Search for user in Mongo
  User.findById(userId, (errUser, user) => {
    // If error finding user
    if (errUser) {
      cb({
        success: false,
        error: errUser.message,
      });
      return;
    // User isn't admin or curator
    } else if (user.userType !== 'admin' && user.userType !== 'curator') {
      cb({
        success: false,
        error: 'General users do not have this privilege.',
      });
      return;
    }
    // Return no error
    cb({
      success: true,
      error: '',
    });
    return;
  });
};

const AdminCheck = (req, cb) => {
  let userId = '';
  // Assign userId to user in backend
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  // If user doesn't exist
  if (!userId) {
    cb({
      success: false,
      error: 'Must be logged in.',
    });
    return;
  }
  // Find the admin in Mongo
  User.findById(userId, (errAdmin, admin) => {
    // Error finding admin
    if (errAdmin) {
      cb({
        success: false,
        error: errAdmin.message,
      });
      return;
    // Can't find admin
    } else if (!admin) {
      cb({
        success: false,
        error: 'User not found.',
      });
      return;
    // User isn't am admin
    } else if (admin.userType !== 'admin') {
      cb({
        success: false,
        error: 'You must be an admin.',
      });
      return;
    }
    // If no errors
    cb({
      success: true,
      error: '',
    });
    return;
  });
};

const UserCheck = (req, cb) => {
  // Isolate userId from backend
  let userId = "";
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  // User is not logged in
  if (!userId) {
    cb({
      success: false,
      error: 'Must be logged in.',
    });
    return;
  }
  // User is logged in
  cb({
    success: true,
    error: '',
  });
  return;
};

const AuthorOrAdminCheck = (req, docId, Document, cb) => {
  // Pull userId from the backend
  let userId = '';
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  // Find the given document in Mongo
  Document.findById(docId, (errDoc, doc) => {
    // Error finding document
    if (errDoc) {
      cb({
        success: false,
        error: errDoc.message,
      });
      return;
    // Cannot find document
    } else if (!doc) {
      cb({
        success: false,
        error: 'No document found.',
      });
      return;
    }
    // Check to make sure user is logged in on backend
    if (!userId) {
      cb({
        success: false,
        error: 'You must be logged in.',
      });
      return;
    }
    // Find user to check if they are author or admin
    User.findById(userId, (errUser, user) => {
      // Error finding user
      if (errUser) {
        cb({
          success: false,
          error: errUser.message,
        });
        return;
      // Cannot find user
      } else if (!user) {
        cb({
          success: false,
          error: 'You must be logged in.',
        });
        return;
      // User is not author or admin
      } else if (user.userType !== 'admin' && user._id !== doc.author) {
        cb({
          success: false,
          error: 'You do not have the right privileges.',
        });
        return;
      }
      // User has privilege to do this, return document
      cb({
        success: true,
        doc,
      });
      return;
    });
  });
};

module.exports = {
  CuratorOrAdminCheck,
  AdminCheck,
  UserCheck,
  AuthorOrAdminCheck,
};
