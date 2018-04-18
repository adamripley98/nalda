// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema contains homepage section information
const homeComponentSchema = new Schema({
  title: String,
  subtitle: String,
  contentType: String,
  content: [],
});

/**
 * Home section model using schema
 */
module.exports = mongoose.model('HomeComponent', homeComponentSchema);
