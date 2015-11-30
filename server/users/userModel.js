// todo make sure that usernames/fbIds are unique
var mongoose = require('mongoose');
var request = require('request');

var UserProfileSchema = new mongoose.Schema({
  username: String,
  fbToken: String,
  fbId: Number,
  categories: [],
  picUrl:String
});


UserProfileSchema.pre('save', function (next) {
  var propertiesObject = { type:'large', redirect:'0', access_token: this.fbToken };
  var url = 'https://graph.facebook.com/' + this.fbId + '/picture';
  request.get({url:url, qs:propertiesObject}, function(err, response) {
    if(err) { console.log(err); return; }
    var respObj = JSON.parse(response.body);
    console.log("Get response: " , respObj );
    this.picUrl = respObj.data.url;
    console.log(this.picUrl);
    next();
  }.bind(this));
});
var UserSchema = mongoose.model('UserProfiles', UserProfileSchema);

module.exports = UserSchema;

