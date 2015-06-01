var endpoints = {},
    fs = require('fs');

endpoints['POST'] = function(req, res, callback){
    //Create (POST) a tweet
    return callback(null, 'YAY');
};

endpoints['GET'] = function(req, res, callback){
    //return specified tweet
    return callback(null, 'BOO');
};

endpoints['DELETE'] = function(req, res, callback){
    //delete tweet
    return callback(null, 'YAY');
};

endpoints.homepage = function(req, res, callback){
    //gets 10? most recent tweets
    return callback(null, 'YAY');
};

module.exports = endpoints;
