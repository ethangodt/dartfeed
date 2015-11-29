var dart = angular.module('dartnews', [
  'dartnews.services',
  'dartnews.feed',
  'dartnews.landing',
  'ngRoute'
])

.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/landingPage', {
      templateUrl: '/app/feed/landingPage.html',
      controller: 'landingController'
    })
    .when('/feed', {
      templateUrl: '/app/newUserPage/newUserPage.html',
      controller: 'FeedController'
    })
    .otherwise({
      redirectTo: '/landingPage'
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