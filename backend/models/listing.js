// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Listing Schema
 * NOTE hours are an object storing opening and closing times for each day of
 * the week
 * TODO display reviewer profile picture
 */
const listingSchema = new Schema({
  title: String,
  description: String,
  location: {
    name: String,
    lat: Number,
    lng: Number,
  },
  image: String,
  rating: Number,
  hours: {},
  price: String,
  website: String,
  author: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  amenities: {
    foodTrucks: Boolean,
    lateNights: Boolean,
    healthy: Boolean,
    forTheSweetTooth: Boolean,
    forTheStudyGrind: Boolean,
    openLate: Boolean,
    parentsVisiting: Boolean,
    gotPlasteredLastNight: Boolean,
    bars: Boolean,
    byos: Boolean,
    speakeasies: Boolean,
    dateNight: Boolean,
    formals: Boolean,
    birthdays: Boolean,
    treatYourself: Boolean,
    adulting: Boolean,
    feelingLazy: Boolean,
    holeInTheWall: Boolean,
    showoffToYourFriends: Boolean,
    forTheGram: Boolean,
  },
  reviews: [
    {
      rating: Number,
      title: String,
      content: String,
      createdAt: Number,
      authorId: String,
    }
  ],
  createdAt: String,
  updatedAt: String,
});

// Creates an index allowing for search functionality
listingSchema.index({"title": "text", "description": "text", "location": "text"});

/**
 * Listing model using schema
 */
module.exports = mongoose.model('Listing', listingSchema);
