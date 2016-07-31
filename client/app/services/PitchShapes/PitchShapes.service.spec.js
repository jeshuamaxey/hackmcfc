'use strict';

describe('Service: PitchShapes', function () {

  // load the service's module
  beforeEach(module('mcfcHackApp'));

  // instantiate service
  var PitchShapes;
  beforeEach(inject(function (_PitchShapes_) {
    PitchShapes = _PitchShapes_;
  }));

  it('should do something', function () {
    expect(!!PitchShapes).toBe(true);
  });

});
