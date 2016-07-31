'use strict';

describe('Directive: ballSpeedVis', function () {

  // load the directive's module and view
  beforeEach(module('mcfcHackApp'));
  beforeEach(module('app/directives/ball-speed-vis/ball-speed-vis.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ball-speed-vis></ball-speed-vis>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the ballSpeedVis directive');
  }));
});