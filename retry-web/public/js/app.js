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
  // CSRF 토큰 설정
  $httpProvider.defaults.xsrfCookieName = 'csrfToken';
  // 오류가 발생했을 때 처리하는 방법
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
  
  // 상태 정의
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
    .state('retry.scan', {
      url: '/scan/:ticketCode',
      views: {
        'content': {
          templateUrl: 'partials/scan',
          controller: 'ScanController'
        }
      }
    })

  $urlRouterProvider.otherwise('/home');
})
