var mongoose = require('mongoose');

// Article model, contains pertinent information about article
module.exports = mongoose.model('Listing', {
  title: String,
  description: String,
  image: String,
  rating: Number,
  hours: {},
  price: String,
  website: String,
  author: {
    name: String,
    _id: String,
    profilePicture: String,
  },
});
