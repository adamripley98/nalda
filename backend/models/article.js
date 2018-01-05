const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema contains pertinent information about the article
const articleSchema = new Schema({
  title: String,
  subtitle: String,
  image: String,
  location: String,
  body: String,
  author: {
    type: Schema.Types.ObjectId, ref: 'User',
  }
});

// Creates an index allowing for search functionality
articleSchema.index({"$**": "text"});

/**
 * Article model using schema
 */
module.exports = mongoose.model('Article', articleSchema);
