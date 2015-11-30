var rss = require('./../rss_modules/rss.js');
var db = require('./../dbInit.js');
var monkeyLearn = require('./UserTreeInterface.js');
var artCtrl = require('./../../server/articles/articleController.js');

db.connect();

rss.then(function(formattedArticles){

  //identify which articles are newer than the newest one currently in the DB
  artCtrl.newArticles(formattedArticles).then(function(newArticles){
    if(newArticles.length === 0){
      db.disconnect();
      return;
    }

    var summaries = newArticles.map(function(articleData){
      return articleData.summary;
    });
    
    //add categories to the articles using monkey learn
    monkeyLearn.classify('Public', summaries, function(err, results){
      if(err){
        console.log(err);
        db.disconnect();
        return;
      }
      var summariesByCategory = {};
      newArticles.forEach(function(article, index){
        //console.dir(article);
        //console.log(JSON.stringify(results));
        article.userScores = {};
        article.category = results[index][0].label;

        //summariesByCategory is an object that stores an array of summaries for each category and the index of each summary in newArticles
        //this is used to get user scores from Monkey Learn and then store them on the appropriate article in newArticles
        if(article.category in summariesByCategory){
          summariesByCategory[article.category].summaries.push(article.summary);
          summariesByCategory[article.category].indices.push(index);
        } else {
          summariesByCategory[article.category] = { summaries: [article.summary], indices: [index] };
        }
      });

      getUserScores(summariesByCategory, newArticles);
    });
  });
});

//assignScores returns a function suitable for processing the return value from monkeyLearn.classify
//a closure is created to track the current category for each monkeyLearn call
//the goal of the function is to update the newArticles object to contain the user scores
var assignScores = function(category, newArticles, summariesByCategory, cb){
  var cat = category;
  var articles = newArticles;
  var summariesByCat = summariesByCategory;   

  return function(err, scores){
    if(err){
      console.log(err);
      db.disconnect();
      return;
    }
    for(var artIndex = 0; artIndex < scores.length; artIndex++){
      for(var userIndex = 0; userIndex < scores[artIndex].length; userIndex++){
        articles[summariesByCat[cat].indices[artIndex]].userScores[scores[artIndex][userIndex][0].label] = scores[artIndex][userIndex][0].probability;
      }
    }
    cb(articles);
  }
}

//getUserScores queries the monkeyLearn API for user scores.  One query is required for each category
//inluded in the new articles found from the RSS feeds
var getUserScores = function(summariesByCategory, newArticles){
  var categoriesComplete = 0;
  var categories = Object.keys(summariesByCategory);
  
  //MonkeyLearn queries must be throttled to avoid overloading the API
  var throttleUserScores = function(catIndex){
    setTimeout(function(){
      var category = categories[catIndex];
      monkeyLearn.classify(category, summariesByCategory[category].summaries, assignScores(category, newArticles, summariesByCategory, function(articles){
        categoriesComplete++;
        //once all the articles have been scored by monkeyLearn, write them all to the DB
        if(categoriesComplete === categories.length){
          artCtrl.writeArticles(articles).then(function(){
            db.disconnect();
          });
        }
      }));
      if(catIndex < categories.length-1){
        throttleUserScores(catIndex+1);
      }
    }, 1000);
  }

  throttleUserScores(0);
}



