var endpoints = {},
    fs = require('fs');

endpoints['POST'] = function(req, res, callback){
    //Create (POST) a tweet
};

endpoints['GET'] = function(req, res, callback){
    //return specified tweet
    fs.readFile(__dirname + req.url, function(err, data){
        if (err){
            res.end(err.toString());
        } else {
            var ext = req.url.split('.')[1];
            res.writeHead(200, {'Content-Type' : 'text/' + ext});
            res.end(data);
        }
    });
};

endpoints['DELETE'] = function(req, res, callback){
    //delete tweet
    callback(data);
};

endpoints.homepage = function(req, res, callback){
    //gets 10? most recent tweets
};

module.exports = endpoints;
