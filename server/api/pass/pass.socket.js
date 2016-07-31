/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Pass = require('./pass.model');

exports.register = function(socket) {
  Pass.schema.post('save', function(doc) {
    onSave(socket, doc);
  });
  Pass.schema.post('remove', function(doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('pass:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pass:remove', doc);
}
