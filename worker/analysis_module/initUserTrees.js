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
userTreeCtrl.getUserCategoryIdsForAllTrees = function (callback) {
  callback();
};
userTreeCtrl.addUserToAllTrees = function(text, callback) {
  callback();
};
userTreeCtrl.addSample = function(stuff, callback) {
  callback();
}
userTreeCtrl.startTrainingAll = function (callback) {
  callback();
}

var randomReadableChar = function () {
    var code = Math.floor(Math.random()*127);
    code = code < 32 ? 32 : code; //average word length will be around 4 letters;
    return String.fromCharCode(code)
}

module.exports.initDummies = function () {
  var dummy = ''
  for(var i = 0; i < 10; i ++) {
    dummy+= randomReadableChar();
  }

  var dummyText = '';
  for(var i = 0; i < 3000; i++) {
    dummyText += randomReadableChar();
  }

  userTreeCtrl.getUserCategoryIdsForAllTrees(function (ids) {
    // console.log(ids) //uncomment if you need to know the rootIds.
    var countIds = _.reduce(ids, function (acc) {
      return acc + 1;
    }, 0);
    userTreeCtrl.addUserToAllTrees(dummy+2, function () {
      _.each(trees, function (value, treeName) {
        userTreeCtrl.addSample([{text: dummyText, category_id: res[sample.user]}], function () {
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
//run it twice or it can't train or classify
//module.exports.initDummies(dummyText);
//module.exports.initDummies(dummyText);
userTreeCtrl.classify('Living', ['A study in the Netherlands backs up a long-held claim of quantum theory, one that Einstein refused to accept, that objects separated by great distance could affect each other\u2019s behavior.","abstract":"Scientists from Delft University of Technology in the Netherlands publish study in journal Nature finding objects separated by great distances can instantaneously affect each other\u2019s behavior, proving one of most fundamental claims of quantum theory'], function (res) {
  // console.log(res);
  console.log('done')
})
