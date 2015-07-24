var http = require('http');
var path = require('path');
var express = require('express');
var server = express();
var io = require('socket.io')();
var sessionHelpers = require('./database/dbHelpers.js').session;
var port = process.env.PORT || 2000;

server.use(express.static(path.join(__dirname, '/public')));

server.get('/:sessionId', function(req, res) {
  sessionHelpers('READ', { id: req.params.sessionId }, function(err, session) {
    if(!session) {
      sessionHelpers('CREATE', { id: req.params.sessionId }, function(err, session) {
        console.log('new session:', session.id);
      });
    }
    res.sendFile(path.join(__dirname, './public/code.html'));
  });
});

var server = http.createServer(server);
io = io.listen(server);

io.sockets.on('connection', function(socket) {

  socket.on('init', function(data) {
    sessionHelpers('READ', data,function(err, result) {
      socket.emit('change', result);
    });
  });

  socket.on('edit', function(data) {
    sessionHelpers('UPDATE', data, function(err, result) {
      if(result){
        socket.broadcast.emit('change', result);
        socket.emit('change', result);
      }
    });
  });
});

server.listen(port, console.log.bind(this, 'listening on port', port));
