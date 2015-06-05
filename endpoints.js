var endpoints = {},
    fs = require('fs'),
    quax = JSON.parse(fs.readFileSync(__dirname + '/quax.json','utf8'));

endpoints.reset = function(){
    quax = undefined;
};

function duckTranslate(quack){
    quackWords = quack.split(' ');
    quackChance = 1 - 1/(Math.pow(quack.length, 2), + 1);
    quackWords.map(function(element){
        return Math.random() < quackChance ? 'QUACK' : element;
    });
}

endpoints['/main POST'] = function(req, res, next){
    var id = new Date().getTime() + Math.floor(Math.random() * 1000),
        brokenUrl = req.url.split('='),
        quack = brokenUrl[1].split('&')[0],
        userID = brokenUrl[2],
        time = new Date().toDateString();

    quack = quack.replace(/%20/g, ' ').replace(/%2E/g, '.');
    quack = duckTranslate(quack);
    if (!quax){
        quax = {};
    }

    quax[id] = {quack : quack, time : time, userID : userID, id : id};
    next();
};

endpoints['/main GET'] = function(req, res, next){
    //return ALL tweets
    res._quaxJSON = JSON.stringify(quax);
    res.end(JSON.stringify(quax));
    next();
};

endpoints['/main DELETE'] = function(req, res, next){
    console.log('hi');
    var body = '';
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        console.log(body);
        id = JSON.parse(body).id;
        delete quax[id];
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

endpoints.quax = quax;
module.exports = endpoints;
