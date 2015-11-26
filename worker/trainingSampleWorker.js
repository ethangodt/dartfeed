// This is the worker that pulls training samples from the trainingSamples collection of the db (populated when a user likes an article).
// It formats them and sends them to monkey learn to teach about user preferences.

var db = require('./dbInit');
var mongoose = require('mongoose');
var trainingSampleCtrl = require('../server/trainingSamples/trainingSampleController');
var monkeyLearn = require('./analysis_module/UserTreeInterface');
var _ = require('underscore');

// pull all training samples from db
trainingSampleCtrl.getAllTrainingSamples()
  .then(function (trainingSamples) {
    return trainingSamples.reduce(function (acc, sample) {
      acc[sample.article.category] = (acc[sample.article.category]) ? acc[sample.article.category].push(sample) : [sample];
      return acc;
    }, {});
  })
  // format the rawSamplesByCategory that came directly from db
  .then(function (rawSamplesByCategory) {
    // fetch user ids from monkey learn
    return new Promise(function (resolve, reject) {
      monkeyLearn.getUserCategoryIdsForAllTrees(function (idsByTree) {
        resolve(idsByTree);
      });
    })
    // reformat the sample to include summary and user sub-category id (from monkey learn)
    .then(function (idsByTree) {
      _.each(rawSamplesByCategory, function (rawSampleList, category) {
        rawSamplesByCategory[category] = rawSampleList.map(function (sample) {
          return {
            text: sample.article.summary,
            category_id: idsByTree[category][sample.userFbId]
          };
        });
      });
      return rawSamplesByCategory; // at this point fully formatted
    });
  })
  // make calls to add training to monkey learn by category
  .then(function (samplesByCategory) {
    return new Promise(function (resolve, reject) {
      var categories = Object.keys(samplesByCategory);
      var expectedCalls = categories.length;
      var count = 0;

      var makeDelayedCall = function () {
        debugger;
        if (count === expectedCalls) {
          resolve();
          return;
        }
        // this is used because the monkeyLearn API blocks requests that are too frequent
        setTimeout(function () {
          var category = categories[count];
          monkeyLearn.addSamples(category, samplesByCategory[category], function () {
            count++;
            makeDelayedCall();
          });
        }, 1500);
      };

      makeDelayedCall(); // called once here, will keep calling itself until all samples are added
    });
  })
  // start training the monkey
  .then(function () {
    monkeyLearn.startTrainingAll(function () {
      console.log('Samples have been successfully added to Monkey Learn!');
    });
  });
