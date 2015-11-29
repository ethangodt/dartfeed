// This file is to establish a connection with the db through the
// mongoose singleton for any individual instances of node that invoke a worker (manually or with cron)

// establish connection
var mongoose = require('mongoose');

module.exports.connect = function() {
  mongoose.connect('mongodb://localhost/dartfeed');
};

module.exports.disconnect = function(cb) {
  mongoose.disconnect(cb);
};

// establish with mongoose models for collection in the db
//var articleInit = require('../server/articles/articleModel');
//var userInit = require('../server/users/userModel');
