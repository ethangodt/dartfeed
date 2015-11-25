// This module grabs all data from supported RSS feeds,
// and returns a promise of formatted, db-friendly articles.
// It does not check that fetched articles haven't already been
// added to the db by a previous fetch.

/*
The formatted article objects look like:

{
  title: '\'Spying\' on Islamic State instead of hacking them',
  linkURL: 'http://www.bbc.co.uk/news/blogs-trending-34879990#sa-ns_mchannel=rss&ns_source=PublicRSS20-sa',
  publisher: 'BBC News - Home',
  content: 'Meet the splinter group of online vigilantes targeting Islamic State',
  imgURL: 'http://ichef-1.bbci.co.uk/news/1024/cpsprodpb/8501/production/_86794043_hacker1.png',
  date: Sun Nov 22 2015 16:32:04 GMT-0800 (PST),
  category: null
}
*/

var Promise = require('bluebird');
var supportedFeeds = require('./supportedFeeds');
var feedReadAsync = Promise.promisify(require('feed-read'));
var articleFormatter = require('./articleFormatter');

// get all articles from feeds using feed-read
var responses = [];
supportedFeeds.forEach(function (feedInfo) {
  responses.push(feedReadAsync(feedInfo.rssUrl));
});

// then translates responses into a db-friendly format, and scrapes for images
module.exports = Promise.all(responses)
  // 'responses' is an array of arrays grouped by rss feed in start order
  .then(function (responses) {
    var formattedArticles = [];
    responses.forEach(function (feedList, rssIndex) {
      feedList.forEach(function (rawArticle) {
        // the rssInfo object is passed into the formatter as 2nd arg primarily to provide the fallback image, but could be used for other formatting info
        formattedArticles.push(articleFormatter(rawArticle, supportedFeeds[rssIndex]));
      });
    });

    return Promise.all(formattedArticles);
  });
