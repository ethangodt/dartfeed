var NPR = {
  rssUrl: 'http://www.npr.org/rss/rss.php?id=100', // Most Emailed Stories
  fallbackArticleImage: 'http://kentanabe.com/wordpress/wp-content/uploads/press_logo_npr.jpg'
};

var BBC = {
  rssUrl: 'http://feeds.bbci.co.uk/news/rss.xml', // Trending News
  fallbackArticleImage: 'https://i.embed.ly/1/display/resize?key=1e6a1a1efdb011df84894040444cdc60&url=http%3A%2F%2Fnewsimg.bbc.co.uk%2Fmedia%2Fimages%2F67373000%2Fjpg%2F_67373987_09f1654a-e583-4b5f-bfc4-f05850c6d3ce.jpg'
};

var supportedFeeds = [NPR, BBC];

module.exports = supportedFeeds;
