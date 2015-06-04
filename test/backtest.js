var assert = require('assert');
var http = require('http');
var fs = require('fs');
var stream = require('stream');
var endpoints = require('../endpoints.js'),
    errors = [],
    testReq,
    testRes;

function assertWell(assertionMethod){
  try {assertionMethod.call([].slice.call(arguments).slice(1));}
  catch (e) {
    errors.push(e);
    console.error(e);
  }
}

endpoints['/main GET'].apply(null, testReqAndRes({method:'GET'}, function(){
    console.log("# Does response contain an element with tweet class?");
    assertWell(assert.ok, data.indexOf("class='tweet'") > -1);
}));

var currentQuax = Object.keys(endpoints.quax).length;
endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', body: 'my quack', url: "quack=blah&userId=idiot"}, function(err, data){
    console.log("# Has a new quack been created?");
    assertWell(assert.equal, Object.keys(endpoints.quax).length, currentQuax + 1);
}));

var currentQuax = Object.keys(endpoints.quax).length;
endpoints['/main DELETE'].apply(null, testReqAndRes({method: 'DELETE', futureProperty: {id: 3}}, function(err, data){
    console.log("# Has a quack been deleted?");
    assertWell(assert.equal, Object.keys(endpoints.quax).length, currentQuax - 1);
}));


endpoints.homepage({}, {}, function(err, data){
  console.log("# Do we get something from the homepage?");
  fs.readFile(__dirname + '../index.html', function(err, index){
    if (err) return new Error('uhoh');
    assertWell(assert.equal, data, index.toString());
  });
});

errors.forEach(function(error){throw error;});

function testReqAndRes(options, callback){
    var result = new stream.Readable();
    for (var key in options){
      result[key] = options[key];
    }
    result.push(options.body);
    result.push(null);
    return [result, new http.ServerResponse(result), callback];
}
