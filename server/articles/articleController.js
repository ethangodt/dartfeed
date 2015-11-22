var Article = require('./articleModel');
var Category = require('../categories/categoryModel');
var Promise = require('bluebird');
Promise.promisifyAll(require('mongoose'));



var getArticles = function (req, res, next) {
  var categories = req.user.categories;
  var resBody = {};
  resBody.articles = [];
  Article.find()
    .in('categories',categories)
    .then(function (articles) {
      resBody.articles = articles;
      resBody.userCats = categories;
      Category.find({})
        .then(function (cats){
          //resBody.allCats = cats.map(function(cat){
          //  return cat.name;
          //})
          resBody.allCats = ['MoneyTech', 'Cats']
          res.json(resBody);
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


module.exports = {
  getArticles:getArticles,
  insertArticles:insertArticles
}
