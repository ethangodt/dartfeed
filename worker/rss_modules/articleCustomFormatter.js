var contentFormatter = require('./contentFormatter');
var imageScraper = require('./imageScraper');

module.exports = function (rawArticle, rssInfo) {
  var formattedArticle = {
    title: rawArticle.title,
    linkURL: rawArticle.link,
    publisher: rawArticle.feed.name,
    content: contentFormatter(rawArticle.content),
    imgURL: null,
    date: rawArticle.published,
    category: null
  };

  return imageScraper(formattedArticle.linkURL)
    .then(function (imgURL) {
      formattedArticle.imgURL = imgURL || rssInfo.fallbackArticleImage;
      return formattedArticle;
    });
};
