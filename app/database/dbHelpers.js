var dbUtils = require('./dbUtils');
var _ = require('lodash');

///////////
// SESSIONS
//   method: CREATE || READ || UPDATE || DELETE
//   reqData:  id, [text, syntax, color]
//   callback: function
var session = function(method, reqData, callback) {
  var query;
  params = [reqData.id];
  callback = callback || _.identity;

  if(method === 'CREATE'){ query = 'INSERT into sessions (id) VALUES ($1) RETURNING *;'; }
  if(method === 'READ'){ query = 'SELECT * FROM sessions WHERE id = $1'; }
  if(method === 'DELETE'){ query = 'DELETE FROM sessions WHERE id = $1'; }

  if(method === 'UPDATE') {
    var count = 2;
    var items = ['text', 'syntax', 'color'];
    query = 'UPDATE sessions SET';
    _.each(items, function(item) {
      if(reqData[item]) {
        query += (' ' + item + ' = $' + count + ',');
        params.push(reqData[item]);
        count++;
      }
    });
    if(count > 2) { query = query.substring(0, query.length - 1) + ' '; }
    query += 'WHERE id = $1 RETURNING *;';
  }

  dbUtils.makeQuery(query, params, function(error, result) {
    if(error) { return dbUtils.handleError(error, callback); }
    var session = (result && result.rows) ? result.rows[0] : null;
    callback(null, session);
  });
};

var clearTables = function(callback) {
  var query = 'TRUNCATE sessions CASCADE;';
  callback = callback || _.identity;

  dbUtils.makeQuery(query, [], function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
}

module.exports = {
  session: session,
  clearTables: clearTables
};
