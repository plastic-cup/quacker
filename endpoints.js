var endpoints = {},
    fs = require('fs'),
    redis = require('redis'),
    baseMake = require('./base'),
    base = baseMake(),
    quackIDs,
    quaxFromDb = [];

endpoints.reset = function(){
    quax = undefined;
};

function duckTranslate(quack){
    quackWords = quack.split(' ');
    quackChance = 1 - 1/(Math.pow(quackWords.length/10,0.15) + 0.01);
    return quackWords.map(function(element){
        var random = Math.random();
        return random < quackChance ? 'QUACK' : element;
    }).join(' ');
}

endpoints['/main POST'] = function(req, res, next){
    var id = new Date().getTime() + Math.floor(Math.random() * 1000);
    var noMain = req.url.split(/\/main\?quack=/)[1];
    var quack = noMain.split(/&userID=\S+/)[0],
        forUserID = noMain.split(/userID=/)[1],
        userID = forUserID.split(/&lat=\S+/)[0],
        interim = forUserID.split("&lon="),
        lat = interim[0].split("&lat=")[1],
        lon = interim[1];

        time = new Date().toDateString();


    // HACKY HACKY HACKY way of dealing with url encoding anomalies
    console.log(quack);
    quack = quack.replace(/%20/g, '&#32;').replace(/%2E/g, '&#46;').replace(/%27/g, "&#39;").replace(/%A3/g, "£").replace(/%80/g, "€");
    quack = quack.replace(/%22/g, '&#34;').replace(/%3E/g, "&gt;").replace(/%3C/g, "&lt;").replace(/%23/g, "&#35;");
    quack = duckTranslate(quack);

    if (!quackIDs){
        quackIDs = [];
    }
    base.addQuack(id, quack, time, userID, function handler(err, reply){
      res.end(JSON.stringify([{quack : quack, time : time, userID : userID, id : id}]));
      next();
    });
};

endpoints['/main GET'] = function(req, res, next){
    base.getQuax(quaxFromDb, function(){
        res._quaxJSON = JSON.stringify(quaxFromDb);
        res.end(JSON.stringify(quaxFromDb));
        quaxFromDb = [];
        next();
    });
};

endpoints['/main DELETE'] = function(req, res, next){
    var body = '';
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        id = JSON.parse(body);
        base.quackle(id);
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

module.exports = endpoints;
