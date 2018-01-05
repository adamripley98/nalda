var mongoose = require('mongoose');

/**
 * Video model
 */
module.exports = mongoose.model('Video', {
  title: String,
  description: String,
  location: String,
  id: String,
});
