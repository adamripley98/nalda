var mongoose = require('mongoose');

// Article model, contains pertinent information about article
module.exports = mongoose.model('Video', {
  title: String,
  description: String,
  id: String,
});
