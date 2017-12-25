var mongoose = require('mongoose');
// User model
// TODO: add more information about user (general user vs content editor, screen name, prof pic, etc)
// userType will determine what privileges users have and what views they can see
module.exports = mongoose.model('User', {
  username: String,
  password: String,
  userType: String,
});
