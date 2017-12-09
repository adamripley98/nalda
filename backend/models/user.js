var mongoose = require('mongoose');
// User model
// TODO: add more information about user (general user vs content editor, screen name, prof pic, etc)
module.exports = mongoose.model('User', {
  username: String,
  password: String,
});
