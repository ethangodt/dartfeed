// This file is to establish a connection with the db through the
// mongoose singleton of the instances of node that invoke the workers.

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dartfeed');

var articleInit = require('../server/articles/articleModel');

var userInit = require('../server/users/userModel');
