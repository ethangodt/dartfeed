var mongoose = require('mongoose');
var Article = require('./articleModel.js');
var Promise = require('bluebird');

// module.exports.writeArticles = function (articles) {
//   var writePromises = [];
//   articles.forEach(function (articleData) {
//     articleData.visitsCount = articleData.visitsCount || 0;
//     articleData.metadata = articleData.metadata || 0;
//     writePromises.push(Article.create(articleData));
//   });

//   return Promise.all(writePromises);
// };

//returns an array of promises of db.create calls to write the new articles
module.exports.writeNewArticles = function(articles){
  var createPromises = [];

  return buildArticlesObject(articles).then(function(latestArticles){
    articles.forEach(function(article){
      if(laterDate(article.date, latestArticles[article.category])){
        createPromises.push(Article.create(article));
      }
    });
    return createPromises;
  });
}; 

var writeIfLater = function(article, latestArticles){
  if(laterDate(articles[i].date, latestArticles[article.category])){
    Article.create(articles[i]);
  }
}

var laterDate = function(date1, date2){
  return Date.parse(date1) > Date.parse(date2);
}

//buildArticleObject returns a promise that resolves with an object with the following format:
// {  category: date of most recent article in DB in that category }
var buildArticlesObject = function(articles){
  var latestArticles = {};
  var ctr = -1;

  var myPromise = new Promise(function(resolve, reject){

    //for each article, we check to see if its category already exists in the object
    //if it doesn't we need to read from the DB to get the date of the most recent article in that category
    //since each operation depends on async DB calls, and we don't know how many articles are in the array
    //I've implemented a recursive function that only moves to the next article when the DB call, if necessary, is complete
    //this avoids a lot of unnecessary DB interaction.  However, the code is ugly and confusing
    //there is hopefully a better way to do this, perhaps using something in bluebird.js
    var helperFunc = function(){
      ctr++;
      if(ctr >= articles.length){
        resolve(latestArticles);
      } else {
        if(!(articles[ctr].category in latestArticles)){
          Article.find({category: articles[ctr].category}).sort({date:-1}).limit(1).exec(function(err, result){
            if(result[0]){
              latestArticles[articles[ctr].category] = result[0].date;
            } else {
              latestArticles[articles[ctr].category] = 0;
            }
            helperFunc();
          })
        } else {
          helperFunc();
        }
      }
    }

    helperFunc();
  });

  return myPromise;
}
