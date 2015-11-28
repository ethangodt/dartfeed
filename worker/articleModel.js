var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
  title: String,
  linkURL: String,
  summary: String, 
  source: String,  //change to publisher?
  imgURL: String,
  date: Date,
  category: String,
  visitsCount: Number,
  metadata: String,
  userLikes: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Article', ArticleSchema);
