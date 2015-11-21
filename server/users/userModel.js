// todo make sure that usernames are unique
var mongoose = require('mongoose');

// probably don't need this anymore
var UserCategorySchema = new mongoose.Schema({
  name: String
}, {_id: false});

var UserProfileSchema = new mongoose.Schema({
  username: String,
  fbToken: String,
  fbId: Number,
  categories: [UserCategorySchema],
  history: [{articleID: Number}],
  following: [{userID: Number}],
  followers: [{userID: Number}]
});

module.exports = mongoose.model('UserProfiles', UserProfileSchema);

// todo delete this
var test = require('../trainingSample/trainingSampleController');
