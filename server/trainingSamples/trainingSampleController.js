var mongoose = require('mongoose');
var TrainingSample = require('./trainingSampleModel');

var addTrainingSample = function (articleID, userFbId) {
  // todo change this to use the mongo id
  return TrainingSample.create({
    article: mongoose.Types.ObjectId(articleID), // building ObjectId from hash
    userFbId: userFbId
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
