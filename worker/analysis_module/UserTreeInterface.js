var request = require('request');
var _ = require('underscore');
var token = require('../../server/config.js').monkeyLearnToken;


//If any of the trees change then the id and root id will have to be updated
//id can be found when veiwing the GUI at app.monkeylearn.com
//you can get the root id by logging the result of getUserCategoryIdsForTree of the 
//tree that's been changed.  Or getUserCategoryIdsForAllTrees if you need to update all of them.
var trees = {
  'Art & Culture': {
    id: 'cl_XZPRupgQ',
    rootId: 561673
  },
  'Business': {
    id: 'cl_zqRxqXyT',
    rootId: 561677
  },
  'Living': {
    id: 'cl_B7cNGLwE',
    rootId: 561679
  },
  'Science & Technology': {
    id: 'cl_zbp9FacQ',
    rootId: 561675
  },
  'Sports': {
    id: 'cl_Kd8K3gda',
    rootId: 561681
  },
  'World': {
    id: 'cl_hy3qhe9v',
    rootId: 561683
  }
};


//an array of the keys from trees.  used in execOnAllTrees.
var treeArr = _.map(trees, function (value, treeName) {
  return treeName;
})

//counts elements in trees
var numTrees = _.reduce(trees, function (acc, id) {
  return acc + 1;
}, 0);

var execOnAllTrees = function (fn) {
  //takes in a function and calls it once for every element in trees throttled to one call every second
  //the function must take a callback as it's last argument.  All other arguments passed into the returned
  //function will be passed to every function call.  the resulting function must be called with a callback as
  //it's last argument.  the results of all function calls will be passed into this callback in an object with
  //the results keyed to their treeName.
  var funcArr = _.map(trees, function (id, treeName) {
    return fn.bind(null, treeName);
  });
  return function () {
    var callback = arguments[arguments.length - 1];
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    var treeNameToRes = {};
    var counter = 0;
    var timeoutCounter = 0;
    _.each(funcArr, function (func, treeNum) {
      setTimeout(function (fn, treeNum) {
        fn.apply(null, args.concat([
          function (result) {
          treeNameToRes[treeArr[treeNum]] = result
          counter ++;
          if(counter >= numTrees) {
            console.log('bulk query finished!')
            callback(treeNameToRes);
          }
          }]
        ));
      }.bind(null, func, treeName), timeoutCounter*1000),
      timeoutCounter++;
    });
  }
}

module.exports = {
  classify: function (treeName, articleArr, callback) {
    //articleArr is an array of strings.  tree name is the key from the trees object.  if it is set to 'Public'
    //the function will use the news categories calssifier.
    //returns an array of arrays of objects. the nested arrays correspond to the strings in articleArr 
    //sequentially.  each object has a category label property and a probability property.
    //ex:
    //articleArr = ['string1', 'string2'];
    //return = [ 
    //  [
    //    {label: 'first category of string1', probability: <decimal number>}, 
    //    {label: 'second category of string1', probability: <decimal number>} ...
    //  ],
    //  [
    //    {label: 'category of string2', probability: <decimal number>} ...
    //  ]
    var URL = treeName === 'Public' ? 'https://api.monkeylearn.com/v2/classifiers/cl_hS9wMk9y/classify/?' : 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/classify/?sandbox=1';
    console.log(URL);
    request.post({
      url: URL,
      headers: {
        'Authorization': 'token ' + token
      },
      json : JSON.stringify({
        text_list: articleArr
      })
    }, function (err, res) {
      // console.log('res: ', res);
      if(err || res.statusCode >= 400) {
        console.log('error in userTree.classify:', err)
        console.log('statusCode', res.statusCode);
      } else {
        var categoryScores = JSON.parse(res.body).result
        callback(categoryScores);
      }
    });
  },
  addSamples: function (treeName, dbTrainingArr, callback) {
    //dbTrainingArr is an array of objects where each object has a 'text' property with the sample text
    //and a category_id property with the category that text should correspond to.
    //ex:
    //[
    //  {text: 'sample 1', category_id: <id obtained from getUserCategoryIdsForTree>},
    //  {text: 'sample 2', category_id: <id obtained from getUserCategoryIdsForTree>} ...
    //]
    request.post({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/samples/',
      headers: {
        'Authorization': 'token ' + token
      },
      json: {
        samples: dbTrainingArr
      }
    }, function (err) {
      if(err || res.statusCode >= 400) {
        console.log('error in userTree.addSamples:', err)
        console.log('statusCode', res.statusCode);
      } else {
        callback();
      }
    });
  },
  startTraining: function (treeName, callback) {
    //trains samples that have been added to the tree
    request.post({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/train/',
      headers: {
        'Authorization': 'token ' + token
      },
    }, function (err, res) {
      if(err || res.statusCode >= 400) {
        console.log('error in userTree.startTraining:', err)
        console.log('statusCode', res.statusCode);
      } else {
        callback(res);
      }
    });
  },
  getUserCategoryIdsForTree: function (treeName, callback) {
    //returns an object with category labels as keys and their corresponding ids as values.
    //ex:
    //{
    //  'category1' : <category_id>,
    //  'category2' : <category_id> ...
    //}
    request.get({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/',
      headers: {
        'Authorization': 'token ' + token
      },
    }, function (err, res) {
      if(err || res.statusCode >= 400) {
        console.log('error in userTree.getUserCategoryIdsForTree:', err)
        console.log('statusCode', res.statusCode);
      } else {
        var userNameToId = _.reduce(JSON.parse(res.body).result.sandbox_categories, function (acc, catObj) {
          acc[catObj.name] = catObj.id;
          return acc;
        }, {}); //includes the root id
        callback(userNameToId);
      }
    });
  },
  addUserToTree: function (treeName, username, callback) {
    //adds username as a category id to the given tree.
    request.post({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/categories/',
      headers: {
        'Authorization': 'token ' + token
      },
      json: {
        "name": username, 
        "parent_id": trees[treeName].rootId
      }
    }, function (err, res) {
      if(err || res.statusCode >= 400) {
        console.log('error in userTree.addUserToTree:', err);
        console.log('statusCode', res.statusCode);
      } else {
        callback();
      }
    });
  }
};
//these functions correspond to their single tree counterparts but run them for all elements in trees
//the api calls are throttled to 1 every second.
module.exports['addUserToAllTrees'] = execOnAllTrees(module.exports.addUserToTree);
module.exports['getUserCategoryIdsForAllTrees'] = execOnAllTrees(module.exports.getUserCategoryIdsForTree);
module.exports['startTrainingAll'] = execOnAllTrees(module.exports.startTraining);


