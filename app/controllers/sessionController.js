var path = require('path');
var socketUtils = require('../utilities/socketUtils');

exports.registerSession = function(req, res) {
  var sessionId = sessions.addNewSession();
  socketUtils.initialize(sessionId, function() {
    res.send(sessionId);
  });
};

exports.redirect = function(req, res) {
  res.redirect(path.join('/', req.params.sessionId || ''));
}
