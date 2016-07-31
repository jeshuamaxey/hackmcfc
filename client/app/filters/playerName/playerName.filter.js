'use strict';

angular.module('mcfcHackApp')
  .filter('playerName', function () {
    return function (input) {
      return input.replace('_', ' ');
    };
  });
