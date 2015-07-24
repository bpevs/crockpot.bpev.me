window.onload = function() {
  var textBox = document.getElementById('text');
  var pathname = window.location.pathname.substring(1);
  console.log(pathname);
  textBox.addEventListener('input', function() {
    socket.emit('edit', {id: pathname, text: textBox.value});
  });

  var socket = io.connect('http://localhost:2000');

  socket.on('connect', function() {
    socket.emit('init', {id: pathname});
  });

  socket.on('change', function(data) {
    console.log(data.id, pathname);
    if(data.id === pathname){
      document.getElementById('code').innerHTML = data.text;
    }
  });
}

