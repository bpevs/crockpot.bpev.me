window.onload = function() {
  var textBox = document.getElementById('text');
  var pathname = window.location.pathname.substring(1);

  textBox.addEventListener('input', function() {
    socket.emit('edit', {id: pathname, text: textBox.value});
  });

  var socket = io.connect('http://localhost:2000');

  socket.on('connect', function() {
    socket.emit('init', {id: pathname});
  });

  socket.on('change', function(data) {
    if(data.id === pathname){
      document.getElementById('text').value = data.text;
    }
  });
}

