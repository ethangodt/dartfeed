var Category = require('./categoryModel');
var User = require('../users/userModel.js');
var Article = require('../articles/articleController');

module.exports = {
  getCategories: function (req, res, next){
    Category.find(function (err, cats){
      res.send(cats);
    });
  },

  updateUserCategories: function(req, res, next){
    User.findOne({_id: req.user.id}, function (err, user){
      if(err) {
        res.send(err);
      }
      if (req.body.type === 'PUT'){
        if (user.categories.indexOf(req.body.category) === -1){
          user.categories.push(req.body.category);
        }
        user.save()
          .then(function(){
            Article.getArticles(req, res, next);
          });
      } else if (req.body.type === "POST"){
        user.categories.splice(user.categories.indexOf(req.body.category),1);
        user.save()
          .then(function () {
            Article.getArticles(req,res,next);
          });
      }
    });
  }
};


