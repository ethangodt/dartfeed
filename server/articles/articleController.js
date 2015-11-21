var Article = require('./articleModel');
var Category = require('../categories/categoryModel');
var User = require('../users/userModel');
var Promise = require('bluebird');
Promise.promisifyAll(require('mongoose')); // todo this needs to be fixed

var getArticles = function (req, res, next) {
  User.findOne({_id: req.user.id})
    .exec(function (err, user){
      var categories = user.categories.filter(function (item){
        return !!item;
      });
      var resBody = {};
      resBody.articles = [];
      Article.find()
        .in('categories',categories)
        .then(function (articles) {
          articles.forEach(function (art) {
            art.userLikes = !!art.userLikes && !!art.userLikes[req.user.id];
          });
          console.log('articles', articles)
          resBody.articles = articles;
          resBody.userCats = categories;
          console.log('resBody', resBody)
          Category.find({})
            .then(function (cats){
              resBody.allCats = cats.map(function(cat){
                return cat.name;
              });
              console.log('resBody', resBody)
              res.json(resBody);
            });
        });
    });
};

var insertArticles = function (req, res, next) {
  var articleData = req.body;
  articleData.forEach(function (articleData) {
    articleData.date = new Date(articleData.date);
    articleData.visitsCount = 0;
    articleData.metadata = 0; //for potential features later
    var catPromises = [];
    var catData = [];
    Article.create(articleData);
    res.send();

  });
};

var userLike = function (req, res, next) {
    Article.findOne({_id:req.body.articleID})
      .exec(function (err, art){
        if(err){
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
  getArticles:getArticles,
  insertArticles:insertArticles,
  userLike: userLike
}
