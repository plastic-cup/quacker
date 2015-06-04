var endpoints = {},
    fs = require('fs'),
    quax;

endpoints['/main POST'] = function(req, res, callback){
    var id = new Date().getTime() + Math.floor(Math.random() * 1000),
        quack = req.url.split('?')[1].split('=')[1],
        time = new Date();

    if (!quax){
        quax = {};
    }

    quax[id] = {quack : quack, time : time};
    console.log(quax);
    return callback(null, 'YAY');
};

endpoints['/main GET'] = function(req, res, next){
    //return ALL tweets
    req._quaxJSON = JSON.stringify(quax);
    next();
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
