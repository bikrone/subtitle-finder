var request = require('request');
var path = require('path');
var hash = require('./utilities/hash');
var fs = require('fs');
var getAllFiles = require('./utilities/getAllFiles');

var userAgent = 'SubDB/1.0 (SubFinder/1.0; http://github.com/bikrone/subtitle-finder)';

var supported_files = [".avi", ".mp4", ".mkv", ".mpg", ".mpeg", ".mov", ".rm", ".vob", ".wmv", ".flv", ".3gp",".3g2"];

var generateUrl = function(url) {
  return {
    url: url,
    headers: {
      'User-Agent': userAgent
    }
  };
}

var isSupported = function(filename) {
  return supported_files.indexOf(path.extname(filename)) > -1;
}

var getLanguages = function(callback) {
  request(generateUrl('http://api.thesubdb.com/?action=languages'), function(err, res, body) {
  if (err) return callback(err);
    callback(null, body);
  });
}

var getSubtitle = function(filename, callback) {
  filename = path.resolve(filename);
  if (!isSupported(filename))
    return callback({error: 'not supported file'});
  hash(filename, function(err, code) {
    if (err) return callback(err);
    request(generateUrl('http://api.thesubdb.com/?action=download&hash=' + code + '&language=en'), function(err, res, body) {
      if (err) return callback(err);
      if (res.statusCode !== 200) callback({error: 'cannot retrieve subtitle'});
      var pathParse = path.parse(filename);
      var pathname = pathParse.dir + '/'+pathParse.name;

      fs.writeFile(pathname + '.srt', body, (err) => {
        if (err) return callback(err);
        callback(null);
      })
    });
  })
}

var getOptions = function() {
  var res = {};
  for (var i = 2; i<process.argv.length; i++) {
    var str = process.argv[i].trim();
    if (str.startsWith('-')) res[str.substr(1)] = true;
    else res.target = str;
  } 
  return res;
}

var opts = getOptions();
if (!opts.target) {
  console.log('HOW TO USE:\nDownload subtitle of a file: node index.js [path_to_file]\nDownload subtitle of a folder: node index.js [path_to_folder] -d\nor recursively: node index.js [path_to_folder] -d -r');
  return;
}
if (opts.d) {
  var isRecursive = false;
  if (opts.r) isRecursive = true;
  var files = getAllFiles(opts.target, isRecursive).filter(isSupported);
  var count = files.length;
  var i = 0;
  files.forEach(function(file) {
    getSubtitle(file, function(err) {
      if (err) {
        console.log('Error in file ' + file, err);
      }
      i++;
      console.log(i+'/'+count);
      if (i == count) {
        console.log('success');
      }
    })
  })
}
else {
  getSubtitle(opts.target, function(err) {
    if (err) return console.log(err);
    console.log('Success');
  })
}