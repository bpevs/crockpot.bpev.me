var expect = require('chai').expect;
var request = require('supertest');
var server = require('../app/server.js');

describe('Restful Routes', function() {

  it('should serve index.html', function(done) {
    request(server)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/<script src="scripts\/main\.js"><\/script>/)
      .end(function(error, response) {
      if(error){ return done(error); }
      done();
    });
  });

  it('should serve static files', function(done) {
    request(server)
      .get('/scripts/connect.js')
      .expect(200)
      .expect('Content-Type', /javascript/)
      .end(function(error, response) {
      if(error){ throw error; }
      done();
    });
  });

  it('should serve code.html', function(done) {
    request('http://localhost:2000/fsdax')
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/<div id="text"><\/div>/)
      .end(function(error, response) {
      if(error){ return done(error); }
      done();
    });
  });
});
