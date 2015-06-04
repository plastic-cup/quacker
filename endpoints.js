var endpoints = {},
    fs = require('fs');

endpoints['/main POST'] = function(req, res, callback){
  return callback(null, 'YAY');
};

endpoints['/main GET'] = function(req, res, callback){
    //return specified tweet
    var quax = require('./quax.js'),
        quaxJSON = {"quax" : [

        ]};

    for (var key in quax){
        quaxJSON.quax.push({"timestamp" : quax.key["timestamp"], "quack" : quax.key["quack"]});
    }

    return callback(null, quaxJSON);
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
