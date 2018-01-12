// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema contains pertinent information about the article
const articleSchema = new Schema({
  title: String,
  subtitle: String,
  image: String,
  body: [
    {
      componentType: String,
      body: String,
    }
  ],
  author: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  createdAt: String,
  updatedAt: String,
  location: {
    name: String,
    lat: Number,
    lng: Number,
  },
});

// Creates an index allowing for search functionality
articleSchema.index({"$**": "text"});

/**
 * Article model using schema
 */
module.exports = mongoose.model('Article', articleSchema);
