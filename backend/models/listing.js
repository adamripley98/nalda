var mongoose = require('mongoose');

// Article model, contains pertinent information about article
module.exports = mongoose.model('Listing', {
  title: String,
  description: String,
  image: String,
  rating: String,
  hours: String,
  price: String,
});
