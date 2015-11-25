var mongoose = require('mongoose');
var TrainingSample = require('./trainingSampleModel');
var User = require('../users/userModel.js');

var addTrainingSample = function (articleID, username) {
  // todo may need to change username to userID, or something — it depends on what id is passed: fb or mongo
  User.find({username: username}).exec() // convert client friendly username to userID hash
    .then(function (user) {
      user = user[0];
      console.log(user._id.valueOf());
      return TrainingSample.create({
        article: mongoose.Types.ObjectId(articleID), // building ObjectId from hash
        userID: user._id.valueOf() // extracting hash string from ObjectId
      });
    });
};

// this function returns all samples and populates the article property of the doc with the actual article doc's summary
var getAllTrainingSamples = function () {
  return TrainingSample.find()
    .populate('article', 'category summary')
    .exec();
};

module.exports = {
  addTrainingSample: addTrainingSample,
  getAllTrainingSamples: getAllTrainingSamples
};
