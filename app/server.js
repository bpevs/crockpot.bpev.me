var http = require('http');
var path = require('path');

var express = require('express');
var server = express();
var io = require('socket.io')();
var hljs = require('highlight.js');
var port = process.env.PORT || 2000;

server.use(express.static(path.join(__dirname, '/public')));

var server = http.createServer(server);
io = io.listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('hello', function(data) {
    console.log('hello', data);
    socket.emit('hello');
  });
});

server.listen(port, console.log.bind(this, 'listening on port', port));
