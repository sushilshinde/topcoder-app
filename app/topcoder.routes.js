(function() {
  'use strict';

  angular.module('topcoder').config([
    '$stateProvider',
    '$urlRouterProvider',
    '$urlMatcherFactoryProvider',
    routes
  ]);

  function routes($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

    // ensure we have a trailing slash
    $urlMatcherFactoryProvider.strictMode(true);
    // rule to add trailing slash
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.url();
      // check to see if the path already has a slash where it should be
      if (path[path.length - 1] === '/' || path.indexOf('/?') > -1 || path.indexOf('/#') > -1) {
        return;
      }
      if (path.indexOf('?') > -1) {
        return path.replace('?', '/?');
      }
      return path + '/';
    });

    var states = {
      '404': {
        parent: 'root',
        url: '/404/',
        template: '<div> Gone Fishing! </div>',
        data: {
          title: 'Page Not Found',
        }
      },
      /**
       * Base state that all other routes should inherit from.
       * Child routes can override any of the specified regions
       */
      'root': {
        url: '',
        abstract: true,
        data: {
          authRequired: false,
        },
        views: {
          'header@': {
            templateUrl: 'layout/header/header.html',
            controller: 'HeaderController',
            controllerAs: 'vm'
          },
          'sidebar@': {
            // TODO revisit to see how the layout works
            templateUrl: 'layout/header/sidebar.html',
          },
          'container@': {
            template: "<div ui-view>Main container, add your stuff here</div>"
          },
          'footer@': {
            templateUrl: 'layout/footer/footer.html',
          }
        }
      },
      'home': {
        // TODO - set new home page
        parent: 'root',
        url: '/',
        template: 'This is the home page',
        controller: ['$state', function($state) {
          $state.go('sample');
        }]
      }
    };

    angular.forEach(states, function(state, name) {
      $stateProvider.state(name, state);
    });

    $urlRouterProvider.otherwise(function($injector) {
      $injector.invoke(['$log', '$state', function($log, $state) {
        $state.go('404');
      }]);

    });
  };
})();