'use strict';

describe('Directive: pitchMap', function () {

  // load the directive's module and view
  beforeEach(module('mcfcHackApp'));
  beforeEach(module('app/directives/pitch-map/pitch-map.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pitch-map></pitch-map>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pitchMap directive');
  }));
});