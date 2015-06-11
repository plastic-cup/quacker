module.exports = function(fake){
    var client;
    if (fake){
        client = fake;
    } else {
        var rtg = require("url").parse(process.env.REDISTOGO_URL);
        console.log(rtg.port, rtg.hostname);
        client = require("redis").createClient(rtg.port, rtg.hostname);
        client.auth(rtg.auth.split(":")[1]);
    }
    // } else {
    //     client = require("redis").createClient();
    // }
    var base = {};

    base.addQuack = function(id, quack, time, userID, lat, lon, address, callback){
    client.hmset(id, "quack", quack, "time", time, "userID", userID, "id", id, "lat", lat, "lon", lon, "address", address, callback);
    };


    base.getQuax = function(quackStore, onEnd){
    client.keys('*', function(err, keys){
        keys.sort().forEach(function(e){
            client.hgetall(e, function(err, quack){
                if (!err){
                    quackStore.push(quack);
                    if (quackStore.length === keys.length) onEnd();
                }
            });
        });
    });

    };

    base.quackle = function(id){
    client.del(id, function(err, reply){
        if (!err){
            console.log(reply + " quack removed from Db");
        }
    });
    };

    return base;

    };
