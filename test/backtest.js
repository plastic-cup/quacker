var assert = require('assert');
var http = require('http');
var fs = require('fs');
var stream = require('stream');
var endpoints = require('../endpoints.js'),
    testReq,
    testRes;

endpoints.GET.apply(null, testReqAndRes({method:'GET'}, function(err, data){
  return data;
}));

assert.equal(endpoints.POST({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');

assert.equal(endpoints.DELETE({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');


endpoints.homepage({}, {}, function(err, data){
    assert.ok(data);
});

function testReqAndRes(options, callback){
  var result = new stream.Readable();
  result.push(options.body);
  result.push(null);
  return [result, new http.ServerResponse(result), callback];
}
