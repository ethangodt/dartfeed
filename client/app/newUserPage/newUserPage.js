angular.module('dartnews.feed', [])
.controller('FeedController', function ($scope, $window, $location, Feed) {
  $scope.errSrc = "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2011/11/data-farm-537x399.jpg";

  //var colorData = {
  //  '50': '#ffffff',
  //  '55': '#ffe5e5',
  //  '60': '#ffcccc',
  //  '65': '#ffb2b2',
  //  '70': '#ff9999',
  //  '75': '#ff7f7f',
  //  '80': '#ff6666',
  //  '85': '#ff4c4c',
  //  '90': '#ff3232',
  //  '95': '#ff1919',
  //  '100': '#ff0000'
  //};
  //
  ////translates a score from 0.5-1.0 to a shade of red
  //var pickColor = function(score){
  //  score = score || 0.5;
  //  var fixedScore = Math.round(score * 100);
  //  var ctr = 50;
  //  while(ctr <= 105){
  //    if(ctr > fixedScore){
  //      ctr -= 5;
  //      return colorData[String(ctr)];
  //    }
  //    ctr += 5;
  //  }
  //};

  var pickColor = function (score) {
    score = score || 0.5;
    if (score < .666) {
      return '#d0cfcc';
    } else if (score < .832) {
      return '#f3dfb4';
    } else {
      return '#feba27';
    }
  };

  var updateData = function (appData){
    $scope.allCategories = appData.allCats;
    $scope.userCategories = appData.userCats;
    $scope.articles = appData.articles;
    for (var i = 0; i < $scope.articles.length; i++) {
      $scope.articles[i].yellowShade = {
        'background-color': pickColor($scope.articles[i].score)
      };
    }
  };

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

  //$scope.getArticlesForUser();

  $scope.articles = testData;
  $scope.allCategories = testAllCategories;
  $scope.userCategories = testUser.categories;
  $scope.user = testUser;

  for (var i = 0; i < $scope.articles.length; i++){
    $scope.articles[i].yellowShade = {
      'background-color': pickColor($scope.articles[i].score)
    }
  }
})
.filter('thirtyWordsMax', function () {
  return function (articleSummary) {
    var shortendSummary = articleSummary.split(' ').slice(0, 29).join(' ');
    var lastChar = shortendSummary[shortendSummary.length - 1];
    if (/[\w]/ig.test(lastChar)) {
      return shortendSummary + '...';
    } else {
      return shortendSummary;
    }
  };
});
