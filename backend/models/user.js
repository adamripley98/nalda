// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * NOTE userType will determine what privileges users have and what views they
 * can see: user, admin, curator
 */
// Schema contains pertinent information about the user
const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  userType: String,
  profilePicture: String,
  location: {
    name: String,
    lat: Number,
    lng: Number,
  },
  bio: String,
  content: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  facebookId: String,
  googleId: String,
});

// Creates an index allowing for search functionality
userSchema.index({"$**": "text"});

/**
 * User model using schema
 */
module.exports = mongoose.model('User', userSchema);
