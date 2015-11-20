var Article = require('./articleModel');
var Category = require('../categories/categoryModel');
var Promise = require('bluebird');
Promise.promisifyAll(require('mongoose'));

module.exports = {

  getArticles : function (req, res, next) {

    numPopularArticles = 5; // number of articles to return for 'popular' parameter
    numArticlesPerPage = 20; // for future feature: add 'offset' parameter to limit # of articles returned

    var popular = req.query.popular; 

    var categories = req.user.categories.map(function (cat) {
      return JSON.parse(JSON.stringify(cat)).name // very weird bug: can only access 'name' property by doing this
      // if you figure out why, let Greg know
    });
    
    if ( popular ) {
      Article.find({}).sort({ visitsCount: -1 })
        .then(function (topArticles) {
          topArticles.splice(numPopularArticles,topArticles.length);
          res.send(topArticles);
          return topArticles;
        }, function (err) {
          console.error(err);
        });
    
    } else if ( categories.length ) {
      var resBody = [];
      var catPromises = [];

      categories.forEach(function (category) {
        catPromises.push(Category.findOne({ name: category})
          .then(function (cat) {
            if ( cat ) {
              resBody.push(cat.articles);
            } else {
              resBody.push();
            }
          }, function (err) {
            console.error(err);
          }));
      });
      Promise.all(catPromises)
        .then(function () {
          res.send(JSON.stringify(resBody));
        });   
    }
  },

  insertArticles : function (req, res, next) {
    var articleData = req.body;
    var artPromises = [];

    artPromises.push(req.body.forEach(function (articleData) {
      articleData.date = new Date(articleData.date);
      articleData.visitsCount = 0;
      articleData.metadata = 0; //for potential features later
      var catPromises = [];
      var catData = [];

      articleData.categories.forEach(function (category) {

        catPromises.push(Category.findOne({ name: category})
          .then(function (cat) {
            var temp = articleData.categories;
            delete articleData.categories;
            if ( cat ) {
              catData.push({categoryID : cat._id, name: cat.name});
              cat.articles.push(articleData);
              articleData.categories = temp;
              return cat.save();
            } else {

              return Category.create({name: category, articles: [articleData]})
                .then(function(newCat) {
                  articleData.categories = temp;
                  catData.push({categoryID : newCat._id, name: newCat.name});
                });
            }
          },function (err) {
            console.error(err);
          })
        );
      });
      
      Promise.all(catPromises).then(function () {
        articleData.categories = catData;
        Article.create(articleData)
        .then( function () {
          console.log('Article written successfully!');
        }, function(err) {
          console.error(err);
        });
      });

    }));

    Promise.all(artPromises).then(function() {
      res.send();
    });

  }
}

