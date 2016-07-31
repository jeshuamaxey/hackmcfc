'use strict';

var app = require('../../app');
var request = require('supertest');

var newPass;

describe('Pass API:', function() {

  describe('GET /api/passes', function() {
    var passs;

    beforeEach(function(done) {
      request(app)
        .get('/api/passes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          passs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      passs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/passes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/passes')
        .send({
          name: 'New Pass',
          info: 'This is the brand new pass!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newPass = res.body;
          done();
        });
    });

    it('should respond with the newly created pass', function() {
      newPass.name.should.equal('New Pass');
      newPass.info.should.equal('This is the brand new pass!!!');
    });

  });

  describe('GET /api/passes/:id', function() {
    var pass;

    beforeEach(function(done) {
      request(app)
        .get('/api/passes/' + newPass._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          pass = res.body;
          done();
        });
    });

    afterEach(function() {
      pass = {};
    });

    it('should respond with the requested pass', function() {
      pass.name.should.equal('New Pass');
      pass.info.should.equal('This is the brand new pass!!!');
    });

  });

  describe('PUT /api/passes/:id', function() {
    var updatedPass

    beforeEach(function(done) {
      request(app)
        .put('/api/passes/' + newPass._id)
        .send({
          name: 'Updated Pass',
          info: 'This is the updated pass!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPass = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPass = {};
    });

    it('should respond with the updated pass', function() {
      updatedPass.name.should.equal('Updated Pass');
      updatedPass.info.should.equal('This is the updated pass!!!');
    });

  });

  describe('DELETE /api/passes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/passes/' + newPass._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pass does not exsist', function(done) {
      request(app)
        .delete('/api/passes/' + newPass._id)
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
