var request = require('request');
var feed = require('feed-read');

function feedParse(url, options){
  this.url = url;
  this.options = options;

  this.parse = function(callback){ //callback(err,articlesCollection)
    feed(this.url, callback);
  };
}

module.exports = feedParse;
