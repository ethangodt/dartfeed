var rssModule = require('./rssModule.js');

var request = require('request');
var cheerio = require('cheerio');
var events = require("events");



function _imageRetrieveAsync(articleURL,options){

  return new Promise(function(resolve,reject){
    request(articleURL,function(error,response,body){
      if(error){
        reject(error);
      }else if(response.statusCode === 200){
        resolve(body);
      }
    }).setMaxListeners(500);
  });
}



function _parseBody(body){
  $ = cheerio.load(body)
  var possImgs = $('img');//ghetto - but the rss feedObjs literally link directly to the sources, no consistency possible.

  if(possImgs.length){
    return possImgs[0].attribs.src ||  possImgs[0].attribs['data'];//hopefully returns an image
  }
  return "http://zetasky.com/wp-content/uploads/2015/01/Blue-radial-gradient-background.png"

}

function _extractContent(input){
  var $ = cheerio.load("<div class='mother'></div>");
  $('div').append(input);
  return ($('.mother').children()[0].prev.data) //<-- this might be REALLY unreliable. But works for first test.

}


function _feedParseAsync(){
  var hrNewsUrl="https://news.ycombinator.com/rss";
  var feedParser = new rssModule(hrNewsUrl);
  return new Promise(function(resolve,reject){
    feedParser.parse(function(error,responses){
      if(error){
        reject(error);
      }else{
        resolve(responses)
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
        mongoObj.source = response.feed.name;
        mongoObj.title = response.title;
        mongoObj.linkURL = response.link;
        mongoObj.date = new Date(response.published).toISOString();
        mongoObj.summary = response.title; //no other possible place to get this atm for this rss feed
        mongoObj.categories=[];
        mongoObj.imgURL = _parseBody(body).trim();
        cb(mongoObj);
    }).catch(function(err){
      console.log(err);
    });

    test(collection,position+1,cb)

  },3000)

}






function hrNewsParser(){
  var self = this;
  this.init = function(cb){
  _feedParseAsync().then(function(responses){
    test(responses,0,cb);
    })
  }
}

module.exports = hrNewsParser;

var qq = new hrNewsParser();
qq.init(function(res){
  console.log(res)
});
