var mongoose = require('mongoose');

/**
 * Listing model
 * NOTE hours are an object storing opening and closing times for each day of
 * the week
 * TODO reviews need a user ID so that we can render the user's profile picture
 * and handle changes to the user's name
 */
module.exports = mongoose.model('Listing', {
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
