var randomLink = function() {
  return ("0000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6);
}

document.getElementById('go').addEventListener('click', function() {
  window.location.pathname = '/' + randomLink();
});
