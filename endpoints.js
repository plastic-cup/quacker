var endpoints = {},
    fs = require('fs'),
    quax;

endpoints['/main POST'] = function(req, res, callback){
    console.log(req.url);
    var id = new Date().getTime() + Math.floor(Math.random() * 1000),
        brokenUrl = req.url.split('='),
        quack = brokenUrl[1].split('&')[0],
        userID = brokenUrl[2],
        time = new Date();

    quack = quack.replace(/%20/g, ' ').replace(/%2E/g, '.');
    if (!quax){
        quax = {};
    }

    quax[id] = {quack : quack, time : time, userID : userID};
    console.log(quax);
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
      callback(err, data.toString());
    });
};

endpoints.default = function(req, res, callback){
    if (req.url.indexOf('.') > -1){
        fs.readFile(__dirname + req.url, function(err, data){
            if (err){
                return callback(err);
            } else {
                return callback(null, data.toString());
            }
        });
    }
};

module.exports = endpoints;
