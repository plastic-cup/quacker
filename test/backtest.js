var assert = require('assert');
var quacksert = require('./quacksert');
var http = require('http');
var fs = require('fs');
var stream = require('stream');
var endpoints = require('../endpoints.js'),
    errors = [],
    testReq,
    testRes;

// endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', body: 'my quack', url: "quack=blah&userId=idiot"}, function(req, res){
//     var currentQuax = Object.keys(endpoints.quax).length;
//     return function(){
//         console.log("# Has a new quack been created?");
//         quacksert(assert.equal, Object.keys(endpoints.quax).length, currentQuax + 1);
//     };
// }));

endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', body: 'my quack', url: "/main?quack=blah&userID=0000&lat=00000&lon=00000"}, function(req, res){
    var currentQuax = endpoints.quackIDs.length;
    return function(){
        console.log("# Has a new quack been created?");
        quacksert(assert.equal, endpoints.quackIDs.length, currentQuax + 1);
    };
}));

// endpoints['/main DELETE'].apply(null, testReqAndRes({method: 'DELETE'}, function(req,res){
//     var currentQuax = endpoints.quackIDs.length;
//     var doomedQuack = endpoints.quackIDs[endpoints.quackIDs.length];
//     req.push('{"id":'+ doomedQuack +'}');
//     req.push(null);
//     return function(){
//         console.log("# Has a quack been deleted?");
//         quacksert.async(assert.equal, Object.keys(endpoints.quax).length, currentQuax - 1);
//     };
// }));

endpoints.homepage.apply(null, testReqAndRes({method: 'GET'}, function(req, res){
    var index = fs.readFileSync(__dirname + '/../index.html');
    return function(){
        console.log('# do we get index back from homepage?');
        assertWell(assert.equal, res.output[2].toString(), index.toString());
    };
}));

quacksert.async(function(){
    fs.rename(__dirname + '/../index.html', __dirname +'/../indes.html');
    endpoints.homepage.apply(null, testReqAndRes({method: 'GET'}, function(req, res){
        return function(error){
            console.log('# do we get an error if index is gone?');
            assertWell(assert.ok, error);
            fs.rename(__dirname + '/../indes.html', __dirname + '/../index.html');
        };
    }));
});

endpoints['/main GET'].apply(null, testReqAndRes({method:'GET'}, function(req, res){
    return function(){
        console.log("# Does response contain something quack-like?");
        assertWell(assert.ok, res.body.indexOf('"quack":') > -1 && res.body.indexOf("time") > -1);
    };
}));

endpoints.default.apply(null, testReqAndRes({method: 'GET', url: 'hi.bye'}, function(req,res){
    return function(error){
      console.log('do we get an error with a none-existent file?');
      assert(error);
    };
}));

endpoints.default.apply(null, testReqAndRes({method: 'GET', url: 'hiiii'}, function(req,res){
    return function(error){
      console.log('do we get an error with a bad path?');
      assert(error);
    };

}));

endpoints.default.apply(null, testReqAndRes({method: 'GET', url: '/style.css'}, function(req,res){
    var css = fs.readFileSync(__dirname + '/../style.css');
    return function(){
      console.log('can we get the css file?');
      assert.equal(css.toString().slice(0,10),res.output[0].slice(res.output[0].indexOf('*')).slice(0,10));
    };
}));

quacksert.async(function(){
  endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', body: 'my quack', url: "/main?quack=blah&userID=0000&lat=0000&lon=0000"}, function(req, res){
      endpoints.reset();
      return function(){
          console.log("# Does post still work with an empty quax?");
          assertWell(assert.ok, endpoints.quax);
      };
  }));
});
var longQuack = "";
for (var i = 0; i < 1000; i++){
    longQuack += "blah%20";
}
endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', body: 'my quack', url: '/main?quack=' + longQuack + '&userID=0000&lat=0000&lon=0000'}, function(req, res){
  return function(){assert(true);};
}));

quacksert.run();

setTimeout(function(){
    errors.forEach(function(error){throw error;});
}, 600);

function assertWell(assertionMethod){
  try {
      assertionMethod.apply(null, [].slice.call(arguments).slice(1));
  }
  catch (e) {
      errors.push(e);
      console.error(e);
  }
}

function testReqAndRes(options, nextMaker){
    var request = new stream.Readable();
    for (var key in options){
        request[key] = options[key];
    }
    if(options.body){
        request.push(options.body);
        request.push(null);
    }
    var reqAndRes = [request, new http.ServerResponse(request)];
    reqAndRes.push(nextMaker.apply(null, reqAndRes));
    return reqAndRes;
}
