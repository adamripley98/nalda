var mongoose = require('mongoose');
// User model
// TODO: add more information about user (general user vs content curator, screen name, prof pic, etc)
// userType will determine what privileges users have and what views they can see: regular, admin, curator
module.exports = mongoose.model('User', {
  username: String,
  password: String,
  userType: String,
});
