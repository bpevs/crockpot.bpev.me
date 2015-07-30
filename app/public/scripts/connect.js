window.onload = function() {
  var pathname = window.location.pathname.substring(1);
  var socket = io.connect(window.location.host);
  var editor;

  socket.on('connect', function() {
    socket.emit('init', {id: pathname});
  });

  socket.on('init', function(data) {

    document.getElementById('syntax').value = data.syntax || 'text';
    document.getElementById('color').value = window.localStorage.getItem('color');

    editor = CodeMirror(document.getElementById('text'), {
      lineNumbers: true,
      mode: data.syntax || 'text',
      theme: window.localStorage.getItem('color'),
      tabSize: 2
    });
    editor.setValue(data.text);

    editor.on('change', function(mirror, change) {
      if(change.origin !== undefined && change.origin !== 'setValue') {
        socket.emit('change', {id: pathname, change: change});
        socket.emit('save', {id: pathname, text: editor.getValue()});
      }
    });
  });

  socket.on('change', function(data) {
    if(data && data.change && data.id === pathname) {
      editor.replaceRange(data.change.text, data.change.from, data.change.to);
    }
    if(data && data.syntax) {
      editor.setOption('mode', data.syntax);
      document.getElementById('syntax').value = data.syntax || 'text';
    }
  });

  document.getElementById('syntax').addEventListener('change', function() {
    var syntax = document.getElementById('syntax').value;
    socket.emit('change', {id: pathname, syntax: syntax});
    editor.setOption('mode', syntax);
  });

  document.getElementById('color').addEventListener('change', function() {
    var color = document.getElementById('color').value;
    window.localStorage.setItem('color', color);
    editor.setOption('theme', color);
  });
}

