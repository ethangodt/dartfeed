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
    //use req.user to save back the updates
    console.log("req.user in update cats ",req.user.id);

    User.findOne({_id: req.user.id}, function (err, user){
      if(err) {
        res.send(err);
      }

        console.log(req.body);
        console.log(user.categories);
      if (user.categories.indexOf(req.body.categories) === -1){
        user.categories.push(req.body.categories);
        console.log(user.categories)
      }
      user.save(function(err) {
        if (err) {
          res.send(err);
        }

        Article.getArticles(req, res, next);
      });
    });
  }
}


