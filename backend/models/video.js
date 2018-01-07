// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema contains pertinent information about the video
const videoSchema = new Schema({
  title: String,
  description: String,
  location: String,
  url: String,
});

// Creates an index allowing for search functionality
videoSchema.index({"$**": "text"});

/**
 * Video model using schema
 */
module.exports = mongoose.model('Video', videoSchema);
