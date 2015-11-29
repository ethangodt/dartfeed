var dart = angular.module('dartnews', [
  'dartnews.services',
  'dartnews.feed',
  'dartnews.user',
  'ngRoute'
])

.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/user', {
      templateUrl: '/app/user/user.html',
      controller: 'UserController'
    })
    .when('/feed', {
      templateUrl: '/app/newUserPage/newUserPage.html',
      controller: 'FeedController'
    })
    .otherwise({
      redirectTo: '/feed',
      templateUrl: '/app/newUserPage/newUserPage.html',
      controller: 'FeedController'
    });
});

dart.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });

      attrs.$observe('ngSrc', function(value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
