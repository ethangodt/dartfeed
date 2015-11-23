var _ = require('underscore');
var userTreeCtrl = require('./UserTreeInterface');

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

//for debugging
// userTreeCtrl.getUserCategoryIdsForAllTrees = function (callback) {
//   callback();
// };
// userTreeCtrl.addUserToAllTrees = function(text, callback) {
//   callback();
// };
// userTreeCtrl.addSample = function(stuff, callback) {
//   callback();
// }
// userTreeCtrl.startTrainingAll = function (callback) {
//   callback();
// }

var randomReadableChar = function () {
    var code = Math.floor(Math.random()*127);
    code = code < 32 ? 32 : code; //average word length will be around 4 letters;
    return String.fromCharCode(code)
}

var makeDummyText = function (length) {
//makes random string of a given length.
  var dummyText = '';
  for(var i = 0; i < length; i++) {
    dummyText += randomReadableChar();
  }
  return dummyText;
}

module.exports.initDummies = function () {
  //adds a user to all trees.  adds a sample to that user for all trees.
  //trains if there are at least two users.
  //must run twice to test classify
  //if run once, cannot classify until at least one user has been added
  var dummy = makeDummyText(10);

  var dummyText = makeDummyText(3000);

  userTreeCtrl.getUserCategoryIdsForAllTrees(function (ids) {
    // console.log(ids) //uncomment if you need to know the rootIds.
    var countIds = _.reduce(ids['Living'], function (acc) {
      return acc + 1;
    }, 0);
    userTreeCtrl.addUserToAllTrees(dummy+2, function () {
      _.each(trees, function (value, treeName) {
        userTreeCtrl.addSample([{text: dummyText, category_id: ids[dummy]}], function () {
          if(countIds > 2) {
            userTreeCtrl.startTrainingAll(function () {
              console.log('initialized dummy users');
            });
          }
        });
      });
    });
  });
};
