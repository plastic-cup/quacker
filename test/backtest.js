var assert = require('assert');
var quacksert = require('./quacksert');
var http = require('http');
var fs = require('fs');
var stream = require('stream');
var baseMake = require('../base');
var fakery = require('./fakery');
var endpoints = require('../endpoints.js')(baseMake(fakery)),
    requestURL = "/main?quack=blah&userID=0000&lat=00000&lon=00000",
    errors = [],
    testReq,
    testRes;

fakery.keys(/.*/, function(err,data){
    var length = data.length;
    endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', url: requestURL}, function(req, res){
        return function(){
            console.log("# Has a new quack been created?");
            fakery.keys(/.*/, function(err, data){
                quacksert(assert.equal, data.length, length + 1);
            });
        };
    }));
});



fakery.keys('*', function(err, data){
    endpoints['/main DELETE'].apply(null, testReqAndRes({method: 'DELETE', url: requestURL}, function(req, res){
        req.push('{"id": "1"}');
        req.push(null);
        return function(){
            console.log('# Has a quack been deleted');
            fakery.keys('*', function(err, newData){
                quacksert(assert.equal, data.length, newData.length);
            });
        };
    }));
});

endpoints.homepage.apply(null, testReqAndRes({method: 'GET'}, function(req, res){
    var index = fs.readFileSync(__dirname + '/../index.html');
    return function(){
        console.log('# do we get index back from homepage?');
        console.log(res.output);
        assertWell(assert.equal, res.output[2].toString(), index.toString());
    };
}));

endpoints['/main GET'].apply(null, testReqAndRes({method:'GET'}, function(req, res){
    return function(){
        var output = JSON.stringify(res.output);
        console.log("# Does response contain something quack-like?");
        assertWell(assert.ok, output.indexOf("quack") > -1 && output.indexOf("time") > -1);
    };
}));


endpoints.default.apply(null, testReqAndRes({method: 'GET', url: 'hi.bye'}, function(req,res){
    return function(error){
      console.log('# do we get an error with a none-existent file?');
      assert(error);
    };
}));

endpoints.default.apply(null, testReqAndRes({method: 'GET', url: 'hiiii'}, function(req,res){
    return function(error){
      console.log('# do we get an error with a bad path?');
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

fs.renameSync(__dirname + '/../index.html', __dirname +'/../indes.html');
endpoints.homepage.apply(null, testReqAndRes({method: 'GET'}, function(req, res){
    return function(error){
        console.log('# do we get an error if index is gone?');
        assertWell(assert.ok, error);
        fs.rename(__dirname + '/../indes.html', __dirname + '/../index.html');
    };
}));

var longQuack = "";
for (var i = 0; i < 1000; i++){
    longQuack += "blah%20";
}
endpoints['/main POST'].apply(null, testReqAndRes({method: 'POST', body: 'my quack', url: requestURL.replace("blah", longQuack)}, function(req, res){

  return function(){assert(true);};
}));

quacksert.run();

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
