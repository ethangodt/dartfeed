angular.module('dartnews.user', [])
.controller('UserController', function ($scope, $window, $location, Feed, $http) {
  $scope.getUserProfile = function (){
    Feed.getUserProfile()
      .then(function (user){
        $scope.user = user;
        console.log('user.data',user.data);
      });
    Feed.getCategories()
      .then(function (categories){
        console.log(categories);
        $scope.categories = categories;
      });
  };
  $scope.addCategoriesToUser = function (){
    Feed.updateUserCategories($scope.selectedCategory)
      .then(console.log('finished'));
  };
});
