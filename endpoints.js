var endpoints = {},
    fs = require('fs');

endpoints.FOO = function(req, res, callback){
    var body = '';

    req.on('data', function(chunk){
      body += chunk.toString();
    });

    req.on('end', function(err, data){
      res.write(body);
      res.end();
    });

    return callback(null, 'FOO');
};

endpoints.POST = function(req, res, callback){
  //create (POST) a tweet

  return callback(null, 'YAY');
};

endpoints.GET = function(req, res, callback){
    //return specified tweet
    return callback(null, 'BOO');
};

endpoints.DELETE = function(req, res, callback){
    //delete tweet
    return callback(null, 'YAY');
};

endpoints.homepage = function(req, res, callback){
    var index = fs.readFile(__dirname + '/index.html',function(){
      res.end(index.toString());
    });
    return callback(null, 'YAY');
};

module.exports = endpoints;
