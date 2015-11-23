var cheerio = require('cheerio');

module.exports = function (rawContent) {
  var $ = cheerio.load(rawContent);
  var paragraphs = $('p');
  if (paragraphs.length) {
    var plainText = '';
    paragraphs.each(function (index, pTag) {
      plainText += $(pTag).text() + '\n';
    });
    return plainText.trim(); // trims last \n
  } else {
    return rawContent;
  }
};
