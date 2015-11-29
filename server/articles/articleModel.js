var mongoose = require('mongoose');


var ArticleSchema = new mongoose.Schema({
  title: String,
  linkURL: String,
  summary: String,
  source: String,
  imgURL: String,
  date: Date,
  categories: [],
  category: String,
  visitsCount: Number,
  metadata: String,
  userLikes: mongoose.Schema.Types.Mixed
});

ArticleSchema.pre('save', function (next){
  this.category = this.categories[0];
  next();

});

module.exports = mongoose.model('Article', ArticleSchema);
