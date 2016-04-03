var fs = require('fs');
var path = require('path');

var getAllFiles = function(dir, isRecursive) {
  dir = path.resolve(dir);
  var results = [];

  fs.readdirSync(dir).forEach(function(file) {
    file = dir + '/' + file;
    var stats = fs.statSync(file);
    
    if (stats && stats.isDirectory()) {        
      if (isRecursive)
        results = results.concat(getAllFiles(file));  
    } else results.push(file);
  });
  return results;
}

module.exports = getAllFiles;