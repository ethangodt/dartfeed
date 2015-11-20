var http = require('http');
// var request = require('request');

var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));


var analyzeContentCallbackPromise = function (textArr) {
  //Lets configure and request
  // console.log("Processing string:", textArr);
  var arr = [];
  arr.push(textArr);
  return new Promise(function (resolve, reject) {

    request.post({
      url: 'https://api.monkeylearn.com/v2/classifiers/cl_bU9URqjk/classify/?debug=1&sandbox=1', //URL to hit
      headers: {
        "Authorization": "token 709c1e5cbdc76dd42282401bbf013d0474a043f6"
      },
      json: {
        text_list: arr
      }

    }, function (error, response, body) {
      // console.log("response from Monk:", response.statusMessage);
      if (error) {
        reject(error);

      } else {

        var responseCategory;
        if ((response.statusCode !== 200) || (body === undefined) ||
          (body.result === undefined)) {
          responseCategory = "GeneralTech";
        } else {
          responseCategory = body.result[0][0].label;
        }
        resolve(responseCategory);
      }
    });
  });

}

module.exports.analyzeContentCallbackPromise = analyzeContentCallbackPromise;