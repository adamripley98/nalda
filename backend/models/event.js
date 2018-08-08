// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Event Schema
 */
const eventSchema = new Schema({
  title: String,
  description: String,
  location: {
    name: String,
    lat: Number,
    lng: Number,
  },
  image: String,
  imagePreview: String,
  images: [],
  price: String,
  website: String,
  date: Date,
  requirements: [],
  author: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  categories: {
    nightTime: Boolean,
    concerts: Boolean,
    dateNights: Boolean,
  },
  createdAt: Number,
  updatedAt: Number,
});

// Creates an index allowing for search functionality
eventSchema.index({"title": "text", "description": "text", "location": "text"});

/**
 * Listing model using schema
 */
module.exports = mongoose.model('Event', eventSchema);
