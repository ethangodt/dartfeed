var mongoose = require('mongoose');

var trainingSampleSchema = new mongoose.Schema({
  article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
  userId: String
});

var TrainingSample = mongoose.model('TrainingSample', trainingSampleSchema);

module.exports = TrainingSample;
