'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var passCtrlStub = {
  index: 'passCtrl.index',
  show: 'passCtrl.show',
  create: 'passCtrl.create',
  update: 'passCtrl.update',
  destroy: 'passCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var passIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './pass.controller': passCtrlStub
});

describe('Pass API Router:', function() {

  it('should return an express router instance', function() {
    passIndex.should.equal(routerStub);
  });

  describe('GET /api/passes', function() {

    it('should route to pass.controller.index', function() {
      routerStub.get
                .withArgs('/', 'passCtrl.index')
                .should.have.been.calledOnce;
    });

  });

  describe('GET /api/passes/:id', function() {

    it('should route to pass.controller.show', function() {
      routerStub.get
                .withArgs('/:id', 'passCtrl.show')
                .should.have.been.calledOnce;
    });

  });

  describe('POST /api/passes', function() {

    it('should route to pass.controller.create', function() {
      routerStub.post
                .withArgs('/', 'passCtrl.create')
                .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/passes/:id', function() {

    it('should route to pass.controller.update', function() {
      routerStub.put
                .withArgs('/:id', 'passCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/passes/:id', function() {

    it('should route to pass.controller.update', function() {
      routerStub.patch
                .withArgs('/:id', 'passCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/passes/:id', function() {

    it('should route to pass.controller.destroy', function() {
      routerStub.delete
                .withArgs('/:id', 'passCtrl.destroy')
                .should.have.been.calledOnce;
    });

  });

});
