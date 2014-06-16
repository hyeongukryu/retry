angular.module('retryApp.filters',
  [
  ]
)

.filter('dateLocal', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD HH:mm:ss');
  }
})

.filter('dateLocalMicro', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD HH:mm:ss.SSS');
  }
})

.filter('trustAsHtml', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
})
.filter('trustAsUrl', function ($sce) {
    return function (val) {
        return $sce.trustAsUrl(val);
    };
})
.filter('concurrencyFilter', function () {
  return function (val) {
    if (!val) {
      return '무제한';
    }
    return val;
  };
})