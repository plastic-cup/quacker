var endpoints = {},
    fs = require('fs'),
    redis = require('redis'),
    request = require('request'),
    quackIDs,
    quaxFromDb = [];


endpoints = function(fake){
    var base = fake || require('./base')();

    function duckTranslate (quack){
        quackWords = quack.split(' ');
        quackChance = 1 - 1/(Math.pow(quackWords.length/10,0.15) + 0.01);
        return quackWords.map(function(element){
            var random = Math.random();
            return random < quackChance ? 'QUACK' : element;
        }).join(' ');
    }

    return {

        '/main POST': function(req, res, next){
            var id = new Date().getTime() + Math.floor(Math.random() * 1000);
            var noMain = req.url.split(/\/main\?quack=/)[1];

            var quack = noMain && noMain.split(/&userID=\S+/)[0],
                forUserID = noMain && noMain.split(/userID=/)[1],
                userID = forUserID && forUserID.split(/&lat=\S+/)[0],
                interim = forUserID && forUserID.split("&lon="),
                lat = interim && interim[0].split("&lat=")[1],
                lon = interim && interim[1],
                time = new Date().toDateString() + " at " + new Date().toTimeString(),
                hashtag,
                geolocationName;

            // HACKY HACKY HACKY way of dealing with url encoding anomalies
            quack = quack && quack.replace(/%20/g, ' ').replace(/%2E/g, '.').replace(/%27/g, "'").replace(/%A3/g, "£").replace(/%80/g, "€");
            quack = quack && quack.replace(/%22/g, '"').replace(/%3E/g, "&gt;").replace(/%3C/g, "&lt;").replace(/%23/g, '#');
            quack = quack && duckTranslate(quack);

                if (quack.indexOf('#')){
                    hashtag = quack.match(/#\w+$|#\w+/);
                }

            if (!quack){
                res.writeHead(500);
                res.end();
                next(new Error("Gosh darn it, no quack!"));
            } else {
                request("https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon, function(err, response, body){
                    if (!err && response.statusCode === 200){
                        geolocationName = JSON.parse(body).address.road + ", " + JSON.parse(body).address.suburb;
                        base.addQuack(id, quack, hashtag, time, userID, lat, lon, geolocationName, function handler(err, reply){
                            res.end(JSON.stringify([{quack : quack, hashtag : hashtag, time : time, userID : userID, id : id, lat: lat, lon: lon, address: geolocationName}]));
                            next();
                        });
                    }
                });
            }

        },

        '/main GET': function(req, res, next){
            base.getQuax(quaxFromDb, function(){
                res._quaxJSON = JSON.stringify(quaxFromDb);
                res.end(JSON.stringify(quaxFromDb));
                quaxFromDb = [];
                next();
            });
        },

        '/main DELETE': function(req, res, next){
            var body = '';
            req.on('data', function(data){
                body += data;
            });
            req.on('end', function(){
                id = JSON.parse(body);
                base.quackle(id);
                next();
            });
        },

        homepage: function(req, res, next){
            fs.readFile(__dirname + '/index.html',function(err,data){
              if (err) next(err);
              else {
                  res.end(data);
                  next();
              }
            });
        },

        default: function(req, res, next){
            if (req.url.indexOf('.') === -1) return next(new Error('oops' + req.url));
            fs.readFile(__dirname + req.url, function(err, data){
                if (err) next(err);
                else {
                    res.writeHead(200, {'Content-Type' : 'text/' + req.url.split('.')[1]});
                    res.end(data);
                    next();
                }
            });
        },
    };
};

module.exports = endpoints;
