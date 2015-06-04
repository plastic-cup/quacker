var endpoints = {},
    fs = require('fs');

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
    fs.readFile(__dirname + '/index.html',function(err,data){
      callback(err,data.toString());
    });
};

module.exports = endpoints;
