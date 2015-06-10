var fakery = {};

fakery.data = {
  1: {quack: 'quack'},
  2: {'quack': "quack", time: '39343290483290'},
  3: 'a little bit more',
};

fakery.error = undefined;

fakery.keys = function(pattern, cb){
  return cb(fakery.error, Object.keys(fakery.data).filter(function(key){
    return key.match(/.*/);
  }));
};

fakery.hgetall = function(key, cb){
  cb(fakery.error, fakery.data[key]);
};

fakery.hmset = function(){
  args = [].slice.call(arguments);
  fakery.data[args[0]] = fakery.data[args.slice(1,-1)];
  args[args.length - 1](fakery.error, true);
};

fakery.del = function(key, cb){
  delete fakery.data[key];
  cb(fakery.error, key);
};


module.exports = fakery;
