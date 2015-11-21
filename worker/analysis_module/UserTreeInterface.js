var request = require('request');
var _ = require('underscore');
var token = require('../../server/config.js').monkeyLearnToken;
var Promise = require('bluebird');

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

var treeArr = ['Art & Culture', 'Business', 'Living', 'Science & Technology', 'Sports', 'World'];

var numTrees = _.reduce(trees, function (acc, id) {
  return acc + 1;
}, 0);

var execOnAllTrees = function (fn) {
  var funcArr = _.map(trees, function (id, treeName) {
    return fn.bind(null, treeName);
  });
  return function () {
    var callback = arguments[arguments.length - 1];
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    var treeNameToRes = {};
    var counter = 0;
    var timeoutCounter = 0;
    _.each(funcArr, function (func, treeName) {
      setTimeout(function (fn, treeName) {
        fn.apply(null, args.concat([
          function (result) {
          treeNameToRes[treeArr[treeName]] = result
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
    var id = treeName === 'Public' ? 'cl_hS9wMk9y' : trees[treeName].id;
    request.post({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + id + '/classify/?sandbox=1',
      headers: {
        'Authorization': 'token ' + token
      },
      json : JSON.stringify({
        text_list: articleArr
      })
    }, function (err, res) {
      var categoryScores = JSON.parse(res.body).result
      if(err) {
        console.log('error in userTree.classify:', err)
      } else {
        callback(categoryScores);
      }
    });
  },
  addSamples: function (treeName, dbTrainingArr, callback) {
    request.post({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/samples/',
      headers: {
        'Authorization': 'token ' + token
      },
      json: {
        samples: dbTrainingArr
      }
    }, function (err) {
      if(err) {
        console.log('error in userTree.addSamples:', err)
      } else {
        callback();
      }
    });
  },
  startTraining: function (treeName, callback) {
    request.post({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/train/',
      headers: {
        'Authorization': 'token ' + token
      },
    }, function (err, res) {
      if(err) {
        console.log('error in userTree.startTraining:', err)
      } else {
        callback(res);
      }
    });
  },
  getUserCategoryIdsForTree: function (treeName, callback) {
    request.get({
      url: 'https://api.monkeylearn.com/v2/classifiers/' + trees[treeName].id + '/',
      headers: {
        'Authorization': 'token ' + token
      },
    }, function (err, res) {
      if(err) {
        console.log('error in userTree.getUserCategoryIdsForTree:', err)
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
        console.log(username)
        callback();
      }
    });
  }
};
module.exports['addUserToAllTrees'] = execOnAllTrees(module.exports.addUserToTree);
module.exports['getUserCategoryIdsForAllTrees'] = execOnAllTrees(module.exports.getUserCategoryIdsForTree);
module.exports['startTrainingAll'] = execOnAllTrees(module.exports.startTraining);
// module.exports['addAllSamples'] = execOnAllTrees(module.exports.addSamples);

var sample = {
  text: "A study in the Netherlands backs up a long-held claim of quantum theory, one that Einstein refused to accept, that objects separated by great distance could affect each other\u2019s behavior.","abstract":"Scientists from Delft University of Technology in the Netherlands publish study in journal Nature finding objects separated by great distances can instantaneously affect each other\u2019s behavior, proving one of most fundamental claims of quantum theory",
  user: "test",
  tree: 'Science & Technology'
}

var testMode = 3;

if(testMode === 0) {
  module.exports.getUserCategoryIdsForTree(sample.tree, function (resWithRoot) {
    module.exports.addUserToTree(sample.tree, sample.user, function () {
      module.exports.addUserToTree(sample.tree, sample.user+2, function () {

        module.exports.getUserCategoryIdsForTree(sample.tree, function (res) {
          console.log(res);
          
          module.exports.addSamples(sample.tree, [{text: sample.text, category_id: res[sample.user]}], function () {

            console.log('\nadded Samples!');

            module.exports.startTraining(sample.tree, function (tRes) {
              console.log('\n Training Started!');
            });

          });

        });

      })
    })
  })
} else if (testMode === 1) {
  module.exports.startTraining(sample.tree, function (tRes) {});
} else if(testMode === 2) {
  module.exports.classify('Public', [sample.text], function (res) {
    console.log(res);
  })
}


