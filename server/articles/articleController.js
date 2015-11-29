var Article = require('./articleModel');
var Category = require('../categories/categoryModel');
var User = require('../users/userModel');
var TrainingSample = require('../trainingSamples/trainingSampleController');
var Promise = require('bluebird');

var getArticles = function (req, res, next) {
  User.findOne({_id: req.user.id})
    .exec(function (err, user) {

      var categories = user.categories.filter(function (item) {
        return !!item;
      });
      var resBody = {};
      resBody.articles = [];
      Article.find()
        .in('categories', categories)
        .then(function (articles) {
          articles.forEach(function (art) {
            art.userLikes = !!art.userLikes && !!art.userLikes[req.user.id];
          });
          //console.log('articles', articles)
          resBody.articles = articles;
          resBody.userCats = categories;
          //console.log('resBody', resBody)
          Category.find({})
            .then(function (cats) {
              resBody.allCats = cats.map(function (cat) {
                return cat.name;
              });
              //console.log('resBody', resBody)
              res.json(resBody);
            });
        });
    });
};

var writeArticles = function (articles) {
  var writePromises = [];
  articles.forEach(function (articleData) {
    articleData.visitsCount = articleData.visitsCount || 0;
    articleData.metadata = articleData.metadata || 0;
    writePromises.push(Article.create(articleData));
  });

  return Promise.all(writePromises);
};

var newArticles = function (rssArticles){
  var newArticles = [];

  return Article.find({}).sort({date:-1}).limit(1).exec().then(function(newestArticle){
    if(newestArticle.length === 0){
      return rssArticles;
    }
    rssArticles.forEach(function(article){
      if(laterDate(article.date, newestArticle[0].date)){
        newArticles.push(article);
      }
    });
    return newArticles;
  })
};

var laterDate = function(date1, date2){
  return Date.parse(date1) > Date.parse(date2);
}

var userLike = function (req, res, next) {
  TrainingSample.addTrainingSample( req.body.articleID,req.user.id);

  Article.findOne({_id: req.body.articleID})
    .exec(function (err, art) {
      if (err) {
        res.send(err);
      } else {
        art.userLikes = art.userLikes || {};
        art.userLikes[req.user.id] = true;
        art.save();
        res.send();
      }
    })
};

module.exports = {
  getArticles: getArticles,
  writeArticles: writeArticles,
  newArticles: newArticles,
  userLike: userLike
}
