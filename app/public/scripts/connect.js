var socket = io.connect('http://localhost:2000');
var roomId = parseInt(Math.random() * 10000);

socket.on('hello', function(data) {
  console.log('yeeee');
});
socket.emit('hello', {'my': 'data'});
