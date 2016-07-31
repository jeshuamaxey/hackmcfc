'use strict';

angular.module('mcfcHackApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/?pathIndex',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
