'use strict';

describe('Filter: playerName', function () {

  // load the filter's module
  beforeEach(module('mcfcHackApp'));

  // initialize a new instance of the filter before each test
  var playerName;
  beforeEach(inject(function ($filter) {
    playerName = $filter('playerName');
  }));

  it('should return the input prefixed with "playerName filter:"', function () {
    var text = 'angularjs';
    expect(playerName(text)).toBe('playerName filter: ' + text);
  });

});
