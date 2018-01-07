// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Listing Schema
 * NOTE hours are an object storing opening and closing times for each day of
 * the week
 * TODO reviews need a user ID so that we can render the user's profile picture
 * and handle changes to the user's name
 */
const listingSchema = new Schema({
  title: String,
  description: String,
  location: String,
  image: String,
  rating: Number,
  hours: {},
  price: String,
  website: String,
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
      name: String,
    }
  ],
});

// Creates an index allowing for search functionality
listingSchema.index({"$**": "text"});

/**
 * Listing model using schema
 */
module.exports = mongoose.model('Listing', listingSchema);
