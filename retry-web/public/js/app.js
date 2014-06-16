angular.module('retryApp',
  [
    'retryApp.services',
    'retryApp.controllers',
    'retryApp.directives',
    'retryApp.filters',
    'ui.router',
    'ngRoute',
    'ui.bootstrap'
  ]
)

.config(function ($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrfToken';
  var interceptor = function ($location, $q) {
    var success = function (response) {
      return response;
    };
    var error = function (response) {
      if (response.status === 401 || response.status === 403) {
        $location.path('/');
      }
      return $q.reject(response);
    };
    return function (promise) {
      return promise.then(success, error);
    };
  };
  $httpProvider.responseInterceptors.push(interceptor);
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  
  $stateProvider
    .state('retry', {
      url: '',
      abstract: true,
      views: {
        '@': {
          templateUrl: 'partials/retry'
        },
        'nav@retry': {
          templateUrl: 'partials/nav'
        }
      }
    })
    .state('retry.home', {
      url: '/home',
      views: {
        'content': {
          templateUrl: 'partials/home',
          controller: 'HomeController'
        }
      }
    })
    .state('retry.guide', {
      url: '/guide',
      views: {
        'content': {
          templateUrl: 'partials/guide',
          controller: 'GuideController'
        }
      }
    })
    .state('retry.sessions', {
      url: '/sessions',
      views: {
        'content': {
          templateUrl: 'partials/sessions',
          controller: 'SessionsController'
        }
      }
    })
    .state('retry.sessionDetail', {
      url: '/sessions/:sessionId',
      views: {
        'content': {
          templateUrl: 'partials/sessionDetail',
          controller: 'SessionDetailController'
        }
      }
    })
    .state('retry.me', {
      url: '/me',
      views: {
        'content': {
          templateUrl: 'partials/me',
          controller: 'MeController'
        }
      }
    })
    .state('retry.admin', {
      url: '/admin',
      views: {
        'content': {
          templateUrl: 'partials/admin',
          controller: 'AdminController'
        }
      }
    })
    .state('retry.scanner', {
      url: '/scanner',
      views: {
        'content': {
          templateUrl: 'partials/scanner',
          controller: 'ScannerController'
        }
      }
    })

  $urlRouterProvider.otherwise('/home');
})
