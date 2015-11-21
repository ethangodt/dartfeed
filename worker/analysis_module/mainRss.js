var feedCat = require("./feedCat.js")
var bbcRSS = require("../crawl_modules/rssCrawls/bbcRss.js")
var cnetRSS = require("../crawl_modules/rssCrawls/cnetRSS.js")
var hrNewsRSS = require("../crawl_modules/rssCrawls/hrNewsRss.js")
var mashRSS = require("../crawl_modules/rssCrawls/mashableRss.js")
var nprRSS = require("../crawl_modules/rssCrawls/nprRss.js")
var tCrunchRSS = require("../crawl_modules/rssCrawls/techCrunchRss.js")
var request = require('request');


var bbcRSS = new bbcRSS();
var cnetRSS = new cnetRSS();
var hrNewsRSS = new hrNewsRSS();
var mashRSS = new mashRSS();
var nprRSS = new nprRSS();
var tCrunchRSS = new tCrunchRSS();


var sendToDb = function (obj) {
  if (obj === null) {
    console.log("Debug this: obj is null; return");
    return;
  }

  request.post({
    url: 'http://127.0.0.1:8000/api/articles', //URL to hit
    headers: {
      "Content-Type": "application/json"
    },
    json: [obj]

  }, function (error, response, body) {
    if (error) {
      console.log(error);
    }
  });

}

var collectCategories = function () {
  var timeoutFactor = 120000;


  setTimeout(function () {

    tCrunchRSS.init(function (obj) {

      feedCat.analyzeContentCallbackPromise(obj.summary)
        .then(function (category) {
          if (obj.categories === undefined) {
            obj.categories = ["GeneralTech"];
          }
          obj.categories = [category];
          sendToDb(obj);
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    })
  }, (0 * timeoutFactor));


  setTimeout(function () {

    cnetRSS.init(function (obj) {

      feedCat.analyzeContentCallbackPromise(obj.summary)
        .then(function (category) {
          if (obj.category === undefined) {
            obj.category = ["GeneralTech"];
          }
          obj.category = [category];
          sendToDb(obj);
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    })
  }, (1 * timeoutFactor));


  setTimeout(function () {

    hrNewsRSS.init(function (obj) {

      feedCat.analyzeContentCallbackPromise(obj.summary)
        .then(function (category) {
          if (obj.category === undefined) {
            obj.category = ["GeneralTech"];
          }
          obj.category = [category];
          sendToDb(obj);
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    })
  }, (2 * timeoutFactor));


  setTimeout(function () {

    mashRSS.init(function (obj) {
      feedCat.analyzeContentCallbackPromise(obj.summary)
        .then(function (category) {
          if (obj.category === undefined) {
            obj.category = ["GeneralTech"];
          }
          obj.category = [category];
          sendToDb(obj);
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    })
  }, (3 * timeoutFactor));


  setTimeout(function () {

    nprRSS.init(function (obj) {

      feedCat.analyzeContentCallbackPromise(obj.summary)
        .then(function (category) {
          if (obj.category === undefined) {
            obj.category = ["GeneralTech"];
          }
          obj.category = [category];
          sendToDb(obj);
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    })
  }, (4 * timeoutFactor));


  setTimeout(function () {

    bbcRSS.init(function (obj) {

      feedCat.analyzeContentCallbackPromise(obj.summary)
        .then(function (category) {
          if (obj.category === undefined) {
            obj.category = ["GeneralTech"];
          }
          obj.category = [category];
          sendToDb(obj);
        })
        .catch(function (error) {
          console.log("Error", error);
        });
    })
  }, (4 * timeoutFactor));
};

collectCategories();
