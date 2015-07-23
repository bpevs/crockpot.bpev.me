var io;

exports.init = function(sessionId, done) {
  if(!io) { io = require('../../server.js').io; }

  var sessionIo = io.on(sessionId);
  sessionIo.on('connect', function(socket) {
    socket.on('edit', function(text) {
      sessions.editText(sessionId, socket.id, text);
      sessionIo.emit('text', data);
    });
  });

  done();
};
