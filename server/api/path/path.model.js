'use strict';

var mongoose = require('mongoose-bird')();
var Schema = mongoose.Schema;

var PathSchema = new Schema({
  successProbability: Number,
  passes: [{
    type: Schema.Types.ObjectId,
    ref: 'Pass' 
  }],
  filename: 'String'
});

module.exports = mongoose.model('Path', PathSchema);
