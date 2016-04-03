var assert = require('assert');
var hash = require('../utilities/hash');

describe('Subtitle Finder', function() {
  describe('#hash()', function() {
    it('should hash dexter.mp4 correctly', function(done) {
      hash('./dexter.mp4', function(err, code) {
        assert.equal(null, err);
        assert.equal('ffd8d4aa68033dc03d1c8ef373b9028c', code); 
        done();
      })      
    });
    it('should hash justified.mp4 correctly', function(done) {
      hash('./justified.mp4', function(err, code) {
        assert.equal('edc1981d6459c6111fe36205b4aff6c2', code);
        done();
      })
    });
  })
})