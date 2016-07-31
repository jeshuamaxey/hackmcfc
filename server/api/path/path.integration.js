'use strict';

var app = require('../../app');
var request = require('supertest');

var newPath;

describe('Path API:', function() {

  describe('GET /api/paths', function() {
    var paths;

    beforeEach(function(done) {
      request(app)
        .get('/api/paths')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          paths = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      paths.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/paths', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/paths')
        .send({
          name: 'New Path',
          info: 'This is the brand new path!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newPath = res.body;
          done();
        });
    });

    it('should respond with the newly created path', function() {
      newPath.name.should.equal('New Path');
      newPath.info.should.equal('This is the brand new path!!!');
    });

  });

  describe('GET /api/paths/:id', function() {
    var path;

    beforeEach(function(done) {
      request(app)
        .get('/api/paths/' + newPath._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          path = res.body;
          done();
        });
    });

    afterEach(function() {
      path = {};
    });

    it('should respond with the requested path', function() {
      path.name.should.equal('New Path');
      path.info.should.equal('This is the brand new path!!!');
    });

  });

  describe('PUT /api/paths/:id', function() {
    var updatedPath

    beforeEach(function(done) {
      request(app)
        .put('/api/paths/' + newPath._id)
        .send({
          name: 'Updated Path',
          info: 'This is the updated path!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPath = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPath = {};
    });

    it('should respond with the updated path', function() {
      updatedPath.name.should.equal('Updated Path');
      updatedPath.info.should.equal('This is the updated path!!!');
    });

  });

  describe('DELETE /api/paths/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/paths/' + newPath._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when path does not exsist', function(done) {
      request(app)
        .delete('/api/paths/' + newPath._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
