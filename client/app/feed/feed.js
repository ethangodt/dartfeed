angular.module('dartnews.feed', [])
.controller('FeedController', function ($scope, $window, $location, Feed) {
	$scope.errSrc = "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2011/11/data-farm-537x399.jpg";

	$scope.getArticlesForUser = function (){
    Feed.getArticlesForUser()
      .then(function (articles){
        $scope.articles = testData;
      });
  };
	});
