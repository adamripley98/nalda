// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema contains pertinent information about the homepage
const homePageSchema = new Schema({
  banner: [
    {
      contentType: String,
      contentId: String,
      contentImage: String,
    }
  ],
  naldaVideos: [],
  categories: [],
  recommended: [],
  fromTheEditors: [],
});

/**
 * Article model using schema
 */
module.exports = mongoose.model('Homepage', homePageSchema);
