var assert = require('assert');
var http = require('http');
var fs = require('fs');
var stream = require('stream');
var endpoints = require('../endpoints.js'),
    testReq,
    testRes;

endpoints['/main GET'].apply(null, testReqAndRes({method:'GET'}, function(err, data){
    console.log("# Does response contain an element with quack class?");
    assert.ok(data.indexOf("class='quack'") > -1);
}));

var currentQuax = Object.keys(quax).length;
endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', body: 'my quack'}, function(err, data){
    console.log("# Has a new quack been created?");
    assert.equal(Object.keys(quax).length, currentQuax + 1);
}));

var currentQuax = Object.keys(quax).length;
endpoints['/main DELETE'].apply(null, testReqAndRes({method: 'DELETE', futureProperty: {id: 3}}, function(err, data){
    console.log("# Has a quack been deleted?");
    assert.equal(Object.keys(quax).length, currentQuax - 1);
}));


endpoints.homepage({}, {}, function(err, data){
    console.log("# Do we get something from the homepage?");
    assert.ok(data);
});

function testReqAndRes(options, callback){
    var result = new stream.Readable();
    result.push(options.body);
    result.push(null);
    return [result, new http.ServerResponse(result), callback];
}
