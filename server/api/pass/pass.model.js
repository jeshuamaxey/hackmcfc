'use strict';

var mongoose = require('mongoose-bird')();
var Schema = mongoose.Schema;

var PassSchema = new Schema({
  passer: {
    name: 'String',
    optaPos: {
      x: Number,
      y: Number
    }
  },
  receiver: {
    name: 'String',
    optaPos: {
      x: Number,
      y: Number
    }
  },
  successProbability: Number
});

module.exports = mongoose.model('Pass', PassSchema);
