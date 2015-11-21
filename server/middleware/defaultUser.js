var mongoose = require('mongoose');
var User = require('../users/userModel.js');

module.exports = function (req, res, next){
  var defaultUserObj = {
   username: "Mark Marmont",
   fbToken: null,
   fbId: 5555
  };

  //If no user already exsists on session, create a default
  console.log("default user middleware", req.originalUrl);
  User.findOne({fbId:5555}, function (err, user){
    if(!user){
      User.create(defaultUserObj, function (err, defaultUser){
        req.user = defaultUser;
        next();
      });      
    } else {
      req.user = user; 
      next();
    }
  })
}