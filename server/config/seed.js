/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var DATA_DIR = './client/data/SIMULATION';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Q = require('q');

var Pass = require('../api/pass/pass.model');
var Path = require('../api/path/path.model');
var User = require('../api/user/user.model');

Pass.find({}).removeAsync();
Path.find({}).removeAsync()
  .then(function() {
    fs.readdir(DATA_DIR, function(err, filenames) {
      filenames = filenames.splice(0, 20);
      _.forEach(filenames, function(filename, i) {
        fs.readFile(path.join(DATA_DIR, filename), 'ascii', function(err, contents) {
          var rows = contents.split('\n');
          rows.pop();
          var passes = _.map(rows, function(row, i) {
            // we can't make a path from just the last row
            if(i === rows.length-1) return undefined;

            var rowPasser = row.split(';');
            var rowReceiver = rows[i+1].split(';');

            var passerName = rowPasser[0].split(':')[0];
            var passerPosition = rowPasser[0].split(':')[1];
            var passerOptaPos = {
              x: parseFloat(rowPasser[1].replace(',', '.')),
              y: parseFloat(rowPasser[2].replace(',', '.'))
            }

            var receiverName = rowReceiver[0].split(':')[0];
            var receiverPosition = rowReceiver[0].split(':')[1];
            var receiverOptaPos = {
              x: parseFloat(rowReceiver[1].replace(',', '.')),
              y: parseFloat(rowReceiver[2].replace(',', '.'))
            }

            if(filename === '1.txt') {
              console.log(rowPasser)
            }

            var successProbability = parseFloat(rowPasser[3].replace(',', '.'));

            return {
              passer: {
                name: passerName,
                optaPos: passerOptaPos
              },
              receiver: {
                name: receiverName,
                optaPos: receiverOptaPos
              },
              successProbability: successProbability
            };
          });

          passes.pop();

          // create all the passes for this path
          Pass.createAsync(passes, function(err, passDocs) {
            if(!err) {
              var savedPasses = [];
              for (var i=1; i<arguments.length; ++i) {
                savedPasses.push(arguments[i]);
              }
            } else {
              console.log(err);
              return;
            }
            // var successProbability = _.reduce(savedPasses, function(prob, passDoc) {
            //   return prob*passDoc.successProbability/100;
            // }, 1);
            Path.create({
              // successProbability: successProbability,
              passes: _.map(savedPasses, '_id'),
              filename: filename
            }, function(err, savedPath) {
              if(err) {
                console.log(err);
              }
            })
          });
        });
      });
      console.log('finished inserting paths');
    });
  });

User.find({}).removeAsync()
  .then(function() {
    User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    })
    .then(function() {
      console.log('finished populating users');
    });
  });
