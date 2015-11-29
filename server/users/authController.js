var User = require('./userModel.js'); 
var body = require('body-parser');
var cookieParser = require('cookie-parser');


module.exports = {

  checkAuth: function(req, res, next) {
    if (req.isAuthenticated()) {
       return next();
    } else {
       return res.send(401); 
    }
  },

  protectedPage: function (req, res, next){
    res.send("protected page");
  },
   
  signin: function (req, res, next){
    res.redirect('/#/feed');
  }, 

  callback: function (req, res, next){
    //send back user.id in the response - client will write out localstorage value 
    //res.send(req.user); //client needs to write this out
    res.redirect('/#/feed');
  },

  signout: function (req, res, next){
    req.session.destroy();
    res.redirect('/#/landingPage');
  }

}
