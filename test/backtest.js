var assert = require('assert');
var http = require('http');
var fs = require('fs');
var endpoints = require('../endpoints.js'),
    testReq,
    testRes;

assert.equal(endpoints.GET({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'BOO');

assert.equal(endpoints.POST({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');

assert.equal(endpoints.DELETE({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');


endpoints.homepage({}, {}, function(err, data){
    assert.ok(data);
});

testReq = {
  on: function(event, callback){
    this[event] = callback;
  },
};

testRes = {
  write: function(stuff){
    this.things = stuff;
  },

  end: function(){
    return this.things;
  }
};

endpoints.FOO(testReq, testRes, function(err, data){
  testReq.data(data);
  assert.ok(testReq.end());
});
