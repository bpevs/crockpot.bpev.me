var expect = require('chai').expect;
var request = require('request');

describe('Restful Routes', function() {

  it('should serve index.html', function(done) {
    request('http://localhost:2000', function(error, response, body) {
      expect(!error).to.equal(true);
      expect(response.statusCode).to.equal(200);
      expect(body).includes('<script src="scripts/main.js"></script>');
      done();
    });
  });

  it('should serve static files', function(done) {
    request('http://localhost:2000/scripts/connect.js', function(error, response, body) {
      expect(!error).to.equal(true);
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should serve code.html', function(done) {
    request('http://localhost:2000/fsdax', function(error, response, body) {
      expect(!error).to.equal(true);
      expect(response.statusCode).to.equal(200);
      expect(body).includes('<div id="text"></div>');
      done();
    });
  });
});
