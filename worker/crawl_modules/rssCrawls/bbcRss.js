var rssModule = require('./rssModule.js');
var request = require('request');
var cheerio = require('cheerio');




function _imageRetrieveAsync(articleURL,options){
  return new Promise(function(resolve,reject){
    request(articleURL,function(error,response,body){
      if(error){
        reject(error);
      }else{
        resolve(body);
      }
    });
  });
}

function _parseBody(body){
  $ = cheerio.load(body)
  var possImgs = $("img.js-image-replace");
  var nextPossImgs = $('img');
  if(possImgs.length){
    return possImgs[0].attribs.src ||  possImgs[0].attribs['datasrc'];//hopefully returns an image
  }
  if(nextPossImgs.length){
    return nextPossImgs[3].attribs.src;
  }
  return "http://zetasky.com/wp-content/uploads/2015/01/Blue-radial-gradient-background.png" //fallback
}

function _feedParseAsync(){
  var bbcUrl = "http://feeds.bbci.co.uk/news/technology/rss.xml";
  var feedParser = new rssModule(bbcUrl);
  return new Promise(function(resolve, reject){
    feedParser.parse(function(error, responses){
      if(error){
        reject(error);
      }else{
        resolve(responses);
      }
    });
  });
}


function test(collection,position,cb){
    if(position === collection.length){
      return;
    }
  setTimeout(function(){

    _imageRetrieveAsync(collection[position].link,{})
    .then(function(body){
      var response = collection[position];
      var mongoObj = {};
      mongoObj.source = "BBC";
      mongoObj.title = response.title;
      mongoObj.linkURL = response.link;
      mongoObj.date = new Date(response.published).toISOString();
      mongoObj.summary = response.content;
      mongoObj.categories=[];
      mongoObj.imgURL = _parseBody(body).trim();
      cb(mongoObj);
    }).catch(function(err){
      console.log(err);
    });

    test(collection,position+1,cb)

  },3000)

}


function bbcParser(){  //pass init a callback and vroom vroom to the boom boom.
  var self = this;
  this.init = function(cb){
    position = 0;
    _feedParseAsync().then(function(responses){
      test(responses,0,cb);
    });
  }
}
// var qq = new bbcParser();

// qq.init(function(results){
//   console.log(results);
// })



module.exports = bbcParser;
