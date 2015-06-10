var endpoints = {},
    fs = require('fs'),
    redis = require('redis'),
    client = redis.createClient(),
    quackIDs,
    quaxFromDb = [];

endpoints.reset = function(){
    quax = undefined;
};

function duckTranslate(quack){
    quackWords = quack.split(' ');
    quackChance = 1 - 0.99/(Math.pow(quackWords.length,0.01) + 0.01);
    return quackWords.map(function(element){
        var random = Math.random();
        return random < quackChance ? 'QUACK' : element;
    }).join(' ');
}

endpoints['/main POST'] = function(req, res, next){
    var id = new Date().getTime() + Math.floor(Math.random() * 1000);
    var brokenUrl = req.url.split(/\/main\?quack=/)[1];
    var quack = brokenUrl.split(/&userID=\d+/)[0],
        userID = brokenUrl.split(/\S+userID=/)[1],
        time = new Date().toDateString();

    // HACKY HACKY HACKY way of dealing with url encoding anomalies
    console.log(quack);
    quack = quack.replace(/%20/g, '&#32;').replace(/%2E/g, '&#46;').replace(/%27/g, "&#39;").replace(/%A3/g, "£").replace(/%80/g, "€");
    quack = quack.replace(/%22/g, '&#34;').replace(/%3E/g, "&gt;").replace(/%3C/g, "&lt;").replace(/%23/g, "&#35;");
    quack = duckTranslate(quack);

    if (!quackIDs){
        quackIDs = [];
    }

    client.hmset(id, "quack", quack, "time", time, "userID", userID, "id", id, function handler(err, reply){
        console.log(reply);
        res.end(JSON.stringify([{quack : quack, time : time, userID : userID, id : id}]));
        next();
    });
};

endpoints['/main GET'] = function(req, res, next){

    client.keys('*', function(err, keys){
        keys.forEach(function(e){
            client.hgetall(e, function(err, quack){
                if (!err){
                    quaxFromDb.push(quack);
                }
            });
        });
    });

    res._quaxJSON = JSON.stringify(quaxFromDb);
    res.end(JSON.stringify(quaxFromDb));

    quaxFromDb = []; // HACKY HACKY HACKY, problems with repeating quacks
    next();
};

endpoints['/main DELETE'] = function(req, res, next){
    var body = '';
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){

        id = JSON.parse(body);
        client.on("error", function (err) {
            console.log("Error " + err);
        });
        client.del(id, function(err, reply){
            if (!err){
                console.log(reply + " quack removed from Db");
            }
        });
        next();
    });
};

endpoints.homepage = function(req, res, next){
    fs.readFile(__dirname + '/index.html',function(err,data){
      if (err) next(err);
      else {
          res.end(data);
          next();
      }
    });
};

endpoints.default = function(req, res, next){
    if (req.url.indexOf('.') === -1) return next(new Error('oops' + req.url));
    fs.readFile(__dirname + req.url, function(err, data){
        if (err) next(err);
        else {
            res.writeHead(200, {'Content-Type' : 'text/' + req.url.split('.')[1]});
            res.end(data.toString());
            next();
        }
    });
};

// endpoints.quackIDs = quackIDs;
module.exports = endpoints;
