var pg = require('pg');
var connectionString = require('../config.js').database.url;

var client = new pg.Client(connectionString);

client.connect(function(error) {
  if(error) { throw error; }
});

var handleError = function(error, callback) {
  if(error) {
    return callback(error);
  }
}

var makeQuery = function(queryString, parameters, callback) {
  client.query(queryString, parameters, function(error, result) {
    if(error) {
      handleError(error, callback);
    } else {
      callback(null, result);
    }
  })
};

module.exports = {
  handleError: handleError,
  makeQuery: makeQuery
}
