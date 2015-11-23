var Promise = require('bluebird');
var cheerio = require('cheerio');
var requestAsync = Promise.promisify(require('request'));

module.exports = function (linkUrl) {
  return requestAsync(linkUrl)
    .then(function (response) {
      var $ = cheerio.load(response.body);
      var commonOption1 = $('meta[property=\'og:image\']').attr('content');
      var commonOption2 = $('meta[name=\'og:image\']').attr('content');
      var commonOption3 = $('.wp-post-image').attr('src');
      var articleImage = commonOption1 || commonOption2 || commonOption3;
      return articleImage;
    })
    .catch(function (err) {
      console.error(err);
    });
};
