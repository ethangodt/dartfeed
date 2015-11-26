// todo make sure that usernames/fbIds are unique
var mongoose = require('mongoose');

var UserCategorySchema = new mongoose.Schema({
  name: String,
}, {_id: false});

var UserProfileSchema = new mongoose.Schema({
  username: String,
  fbToken: String,
  fbId: Number,
  categories: [],
  history: [ {articleID: Number} ],
  following: [ {userID: Number} ],
  followers: [ {userID: Number} ]
});

module.exports = mongoose.model('UserProfiles', UserProfileSchema);
