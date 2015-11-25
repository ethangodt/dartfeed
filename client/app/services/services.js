angular.module('dartnews.services', [])
.factory('Feed', function ($http){

  var getUserProfile = function (){
    return $http({
      url: '/api/user', 
      method: 'GET'
    });
  };

  var getCategories = function (){
    return $http({
      url: '/api/categories', 
      method: 'GET'
    });
  };

  var updateUserCategories = function (category, type){
    return $http({
      url: '/api/categories', 
      method: 'PUT',
      data: {
        category: category,
        type:type
      }
    });
  };

  var getArticlesForUser = function (){
    return $http({
      url: '/api/articles', 
      method: 'GET'
    });
  };

  var likeArticle = function(articleID){
    return $http({
      url: '/api/user/like',
      method: 'PUT',
      data: {
        articleID: articleID
      }
    });  
  };

  return {
    getUserProfile: getUserProfile,
    getCategories: getCategories,
    updateUserCategories: updateUserCategories, 
    getArticlesForUser: getArticlesForUser

  }

})
