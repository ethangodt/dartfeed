var request = require('request');
var _ = require('underscore');
var token = require('../../server/config.js').monkeyLearnToken;
var Promise = require('bluebird');
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

var dummyText = '';
var dummy = 'Dummy'

for(var i = 0; i < 3000; i++) {
  var code = Math.floor(Math.random()*127);
  code = code < 32 ? 32 : code;
  dummyText += String.fromCharCode(code)
}

module.exports.initDummies = function (text) {
  // userTreeCtrl.getUserCategoryIdsForAllTrees(function (ids) {
      // userTreeCtrl.addUserToAllTrees(dummy+2, function () {
      //   console.log('wut')
      // })
  // })
  userTreeCtrl.startTrainingAll(function () {
    console.log('done')
  })
}

module.exports.initDummies(dummyText);
// console.log(dummyText)
