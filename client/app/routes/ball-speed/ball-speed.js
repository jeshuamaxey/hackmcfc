'use strict';

angular.module('mcfcHackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ball-speed', {
        url: '/ball-speed',
        templateUrl: 'app/routes/ball-speed/ball-speed.html',
        controller: 'BallSpeedCtrl'
      });
  });