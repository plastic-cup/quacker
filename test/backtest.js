var assert = require('assert');
var http = require('http');
var endpoints = require('../endpoints.js'),
    testReq;

assert.equal(endpoints.GET({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'BOO');

assert.equal(endpoints.POST({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');

assert.equal(endpoints.DELETE({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');

assert.equal(endpoints.homepage({on: function(){return;}}, {}, function(err, data){
    return err || data;
}), 'YAY');

testReq = http.request({'url':'foo', 'port':8000}, function(res){
  res.on('end', function(){assert.ok(true);});
});

testReq.write('stringene');

testReq.end();
