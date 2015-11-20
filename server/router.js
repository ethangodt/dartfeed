var authController = require('./users/authController');
var userController = require('./users/userController'); 
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config.js'); 
var articleController = require('./articles/articleController'); 
var categoryController = require('./categories/categoryController'); 


module.exports = function (router) {
  router.get('/api/users', userController.getAllUsers);
  router.get('/api/user', userController.getCurrentUser);
  router.get('/api/user/:user_id', userController.getUser);
  router.get('/api/auth/signin', authController.signin);
  router.get('/api/auth/protected', authController.checkAuth, authController.protectedPage); 

  router.get('/api/auth/signout', authController.signout);
  router.get('/api/auth/callback', authController.callback);
  router.get('/api/auth/facebook', passport.authenticate('facebook'));
  router.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/api/auth/callback', failureRedirect: '/api/auth/signin' }));

  router.get('/api/articles', articleController.getArticles);
  router.post('/api/articles', articleController.insertArticles);

  router.get('/api/categories', categoryController.getCategories);
  router.put('/api/categories', categoryController.updateUserCategories);
}