module.exports = function(fake){
  var client = fake || require('redis').createClient();
  var base = {};

  base.addQuack = function(id, quack, time, userID, callback){
    client.hmset(id, "quack", quack, "time", time, "userID", userID, "id", id, callback);
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
