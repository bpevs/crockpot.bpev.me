var expect = require('chai').expect;
var dbHelpers = require('../app/database/dbHelpers.js');

describe('Database ', function() {
  var sessionId = 'test';

  it('should create a session', function(done) {
    dbHelpers.session('CREATE', { id: sessionId }, function(err, result) {
      expect(result).to.deep.equal({id: sessionId, text:null, syntax: null, color: null});
      done();
    });
  });

  it('should read a session', function(done) {
    dbHelpers.session('READ', { id: sessionId }, function(err, result) {
      expect(result).to.deep.equal({id: sessionId, text:null, syntax: null, color: null});
      done();
    });
  });

  it('should update a session', function(done) {
    dbHelpers.session('UPDATE', { id: sessionId, text:'lalala', syntax:'text', color: 'monokai' }, function(err, result) {
      expect(result).to.deep.equal({id: sessionId, text:'lalala', syntax:'text', color: 'monokai'});
      done();
    });
  });

  it('should not update undefined parameters', function(done) {
    dbHelpers.session('UPDATE', { id: sessionId, text:'lalala', color: 'monokai' }, function(err, result) {
      expect(result).to.deep.equal({id: sessionId, text:'lalala', syntax:'text', color: 'monokai'});
      done();
    });
  });

  it('should delete sessions', function(done) {
    dbHelpers.session('READ', { id: sessionId }, function(err, result) {
      expect(result).to.deep.equal({id: sessionId, text:'lalala', syntax:'text', color: 'monokai'});
      dbHelpers.session('DELETE', { id: sessionId }, function(err, result) {
        dbHelpers.session('READ', { id: sessionId }, function(err, result) {
          expect(result).to.equal(undefined);
          done();
        });
      });
    });
  });

});
