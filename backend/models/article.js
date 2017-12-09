var mongoose = require('mongoose');

// Article model, contains pertinent information about article
module.exports = mongoose.model('Article', {
  title: String,
  subtitle: String,
  image: String,
  body: String,
});
