var rss = require('./../rss_modules/rss.js');
var db = require('./../dbInit.js');
var monkeyLearn = require('./UserTreeInterface.js');
var dbServices = require('./../dbServices');

db.connect();

rss.then(function(formattedArticles){
  var summaries = formattedArticles.map(function(articleData){
    return articleData.summary;
  });
  
  monkeyLearn.classify('Public', summaries, function(results){
    formattedArticles.forEach(function(article, index){
      article.category = results[index][0].label;
    });

    dbServices.writeNewArticles(formattedArticles).then(function(articlesWritten){
      console.log('wrote ' + articlesWritten.length + ' articles');
      db.disconnect();
    })
  });  
});