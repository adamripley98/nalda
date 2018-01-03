var mongoose = require('mongoose');

// Article model, contains pertinent information about article
module.exports = mongoose.model('Listing', {
  title: String,
  description: String,
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
  }
});
