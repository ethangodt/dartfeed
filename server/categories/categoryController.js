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
<<<<<<< 2f4deb52a95fc74ab668ba33032d4c2f871369d2
    console.log("req.user in update cats ",req.user.id);
=======
    console.log(req.user.id)
>>>>>>> server refactor + interface with client
    User.findOne({_id: req.user.id}, function (err, user){
      if(err) {
        res.send(err);
      }
<<<<<<< 2f4deb52a95fc74ab668ba33032d4c2f871369d2
      console.log(user.categories)
      if (user.categories.indexOf(req.body.categories.category) === -1){
        user.categories.push(req.body.categories.category);
=======
        console.log(req.body);
        console.log(user.categories)
      if (user.categories.indexOf(req.body.categories) === -1){
        user.categories.push(req.body.categories);
        console.log(user.categories)
>>>>>>> server refactor + interface with client
      }
      user.save(function(err) {
        if (err) {
          res.send(err);
        }
<<<<<<< 2f4deb52a95fc74ab668ba33032d4c2f871369d2
        console.log(user); 
        res.status(201);
        res.json({ message: 'User updated!' });
=======
        Article.getArticles(req, res, next);
>>>>>>> server refactor + interface with client
      });
    });
  }
}


