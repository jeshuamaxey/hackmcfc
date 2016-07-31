'use strict';

describe('Controller: BallSpeedCtrl', function () {

  // load the controller's module
  beforeEach(module('mcfcHackApp'));

  var BallSpeedCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BallSpeedCtrl = $controller('BallSpeedCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
