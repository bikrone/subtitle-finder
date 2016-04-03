var crypto = require('crypto');
var fs = require('fs-ext');

var md5 = function(data) {
  return crypto.createHash('md5').update(data).digest("hex");
}

var SEEK_SET = 0;
var SEEK_CUR = 1;
var SEEK_END = 2;

var read = function(fd, buffer, offset, length, position) {
  return new Promise(function(resolve, reject) {
    fs.read(fd, buffer, offset, length, position, function(err, bytes) {
      if (err) return reject(err);
      resolve(bytes);
    });
  });
}

var open = function(filename, mode) {
  return new Promise(function(resolve, reject) {
    fs.open(filename, mode, function(err, fd) {
      if (err) return reject(err);
      resolve(fd);
    })
  });
};

var seek = function(fd, offset, whence) {
  return new Promise(function(resolve, reject) {
    fs.seek(fd, offset, whence, function(err, currFilePos) {
      if (err) return reject(err);
      resolve(currFilePos);
    })
  });
}

var encode = function(filename, callback) {
  var readsize = 64 * 1024;
  var buf = new Buffer(readsize*2);
  var fd = null;
  open(filename, 'r')
  .then(function(file) {
    fd = file;
    return read(fd, buf, 0, readsize, 0);
  })
  .then(function(bytes) {
    return seek(fd, -readsize, SEEK_END);
  })
  .then(function(currFilePos) {
    return read(fd, buf, readsize, readsize, currFilePos);
  })
  .then(function(bytes) {
    var hash = md5(buf);
    callback(null, hash);
  })
  .catch(callback);
};

module.exports = encode;