angular.module('dartnews.feed', [])
.controller('FeedController', function ($scope, $window, $location, Feed) {
  $scope.errSrc = "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2011/11/data-farm-537x399.jpg";


  var getData = function (){
    Feed.getUserProfile()
      .then(function (user){
        //$scope.user = user; 
      })
    Feed.getCategories()
      .then(function (categories){
        //$scope.categories = categories; 
      })
    Feed.getArticlesForUser()
      .then(function (articles){
        //$scope.articles = articles;
      });
  };

  var updateData = function (appData){
    $scope.allCategories = appData.allCats;
    $scope.userCategories = appData.userCats;
    $scope.articles = appData.articles;
    /*for(var i = 0; i < $scope.articles.length; i++){
      var normalizedScore = $scope.articles[i].score
      $scope.redShade[i] = {
        color: 'rgb(' + $scope.articles[i].score
      }
    }*/
  }

  $scope.getArticlesForUser = function (){
    Feed.getArticlesForUser()
      .then(function (response){
        updateData(response.data);
      });
  };

  $scope.removeCategory = function (categoryIndex){
    Feed.updateUserCategories($scope.userCategories[categoryIndex], 'DELETE')
    .then(function(response){
      updateData(response.data);
    });
  };

  $scope.addCategory = function (category){
    Feed.updateUserCategories(category, 'PUT')
    .then(function(response){
      updateData(response.data);
    });
  };

  $scope.likeArticle = function (articleIndex){
    var articleID = $scope.articles[articleIndex]._id || 'no ID'; //get rid of this once we have article IDs
    Feed.likeArticle(articleID);
  };

  $scope.signOut = function (){
    Feed.signOut();
  };

  $scope.categoryFilter = function (filterInput) {
    for (var i = 0; i < $scope.userCategories.length; i++){
      if(filterInput === $scope.userCategories[i]){
        return false;
      }
    }
    return true;
  };

  $scope.getArticlesForUser();

});
