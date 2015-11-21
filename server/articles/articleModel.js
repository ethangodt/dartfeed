var mongoose = require('mongoose');

var ArticleCategorySchema = new mongoose.Schema({
  categoryID: String,
  name: String
}, { _id: false});

var ArticleSchema = new mongoose.Schema({
  title : String,
  linkURL: String,
  summary: String,
  source: String,
  imgURL: String,
  date: Date,
  categories: [ArticleCategorySchema],
  visitsCount : Number,
  metadata : String
});

module.exports = mongoose.model('Article', ArticleSchema);
