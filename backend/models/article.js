var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Article model, contains pertinent information about article
module.exports = mongoose.model('Article', {
  title: String,
  subtitle: String,
  image: String,
  body: String,
  author: {
    type: Schema.Types.ObjectId, ref: 'User',
  }
});
