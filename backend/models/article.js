var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Article model
 * Contains pertinent information about article
 */
module.exports = mongoose.model('Article', {
  title: String,
  subtitle: String,
  image: String,
  body: [
    {
      type: String,
      body: String,
    }
  ],
  author: {
    type: Schema.Types.ObjectId, ref: 'User',
  }
});
