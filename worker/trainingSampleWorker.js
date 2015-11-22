// This is the worker that pulls training samples from the trainingSamples collection of the db
// (populated when a user likes an article), formats them, and sends them to monkey learn to teach about user preferences

// this is used to connect this node instance's mongoose singleton to mongo server
var db = require('./dbInit');
var mongoose = require('mongoose');
var trainingSampleCtrl = require('../server/trainingSample/trainingSampleController');
var monkeyLearn = require('./analysis_module/UserTreeInterface');

// pull all training samples and assign to variable
trainingSampleCtrl.getAllTrainingSamples()
  .then(function (trainingSamples) {
    // console.log(trainingSamples);
  });

// pull all the category information from the monkeyLearn api and assign to variable
monkeyLearn.getUserCategoryIdsForAllTrees(function (payload) {
  // any function that uses the all trees abstraction should come with an object where categories are keys
});

// pair ml and samples into array of objects like [{text: summary, categoryId: userId}]

// call addSamples function for each category from the database

// when all samples have been added, call train monkey
