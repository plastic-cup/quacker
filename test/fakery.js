var fakery = {};

fakery.data = {
  1: 'data',
  2: 'loads of data',
  3: 'a little bit more',
};

fakery.keys = function(pattern, cb){
  return cb(undefined, Object.keys(fakery.data).filter(function(key){
    return key.match(pattern);
  }));
};

fakery.hgetall = function(key, cb){
  cb(undefined, fakery.data[key]);
};

fakery.hmset = function(){
  args = [].slice.call(arguments);
  fakery.data[args[0]] = fakery.data[args.slice(1,-1)];
  fakery.data[args.length - 1](undefined, true);
};

fakery.del = function(key, cb){
  delete fakery.data[key];
  cb(undefined, key);
};


module.exports = fakery;
