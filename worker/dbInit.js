// this file is to establish a connection with the db through the
// mongoose singleton of the instance of node that invokes the workers

var mongoose = require('mongoose');
var articleInit = require('mongoose');
mongoose.connect('mongodb://localhost/dartfeed');

module.exports = mongoose;
