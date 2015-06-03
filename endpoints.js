var endpoints = {},
    fs = require('fs');

endpoints['/main POST'] = function(req, res, callback){
  return callback(null, 'YAY');
};

endpoints['/main GET'] = function(req, res, callback){
    //return specified tweet
    return callback(null, 'BOO');
};

endpoints['/main DELETE'] = function(req, res, callback){
    //delete tweet
    return callback(null, 'YAY');
};

endpoints.homepage = function(req, res, callback){
    fs.readFile(__dirname + '/index.html',function(err,data){
      callback(err,data.toString());
    });
};

module.exports = endpoints;
