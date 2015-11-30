// This is the worker that pulls training samples from the trainingSamples collection of the db (populated when a user likes an article).
// It formats them and sends them to monkey learn to teach about user preferences.

var db = require('./dbInit');
var mongoose = require('mongoose');
var trainingSampleCtrl = require('../server/trainingSamples/trainingSampleController');
var monkeyLearn = require('./analysis_module/UserTreeInterface');
var _ = require('underscore');

// establish with mongoose models for collection in the db
db.connect();
var articleInit = require('../server/articles/articleModel');
var userInit = require('../server/users/userModel');

// pull all training samples from db
trainingSampleCtrl.getAllTrainingSamples()
  .then(function (trainingSamples) {
    console.log('All training samples have been fetched.');
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
        console.log('The category ids have been successfully fetched from Monkey Learn.');
        resolve(idsByTree);
      });
    })
    // reformat the sample to include summary and user sub-category id (from monkey learn)
    .then(function (idsByTree) {
      _.each(rawSamplesByCategory, function (rawSampleList, category) {
        rawSamplesByCategory[category] = rawSampleList.map(function (sample) {
          return {
            text: sample.article.summary,
            category_id: idsByTree[category][sample.userId]
          };
        });
      });
      console.log('The articles and category ids have been successfully formatted together.');
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
        if (count === expectedCalls) {
          console.log('All calls have successfully been made.');
          resolve();
          return;
        }
        // this is used because the monkeyLearn API blocks requests that are too frequent
        setTimeout(function () {
          var category = categories[count];
          monkeyLearn.addSamples(category, samplesByCategory[category], function () {
            count++;
            console.log(count + ' of ' + expectedCalls + ' sample adding calls.');
            makeDelayedCall();
          });
        }, 1500);
      };

      makeDelayedCall(); // called once here, will keep calling itself until all samples are added
    });
  })
  .then(function () {
    debugger;
    return trainingSampleCtrl.clearAllTrainingSamples()
      .then(function () {
        console.log('Training sample collection has been cleared.');
        db.disconnect(); // from this point on the connection with the db isn't necessary
      });
  })
  // start training the monkey
  .then(function () {
    monkeyLearn.startTrainingAll(function () {
      console.log('The monkey has successfully been trained!');
    });
  });
