var assert = require('assert');
var endpoints = require('../endpoints.js');

endpoints.GET({url: 'tweet'}, {}, function(err, data){
    assert.ok(data);
});

endpoints.POST({url: 'tweet'}, {}, function(err, data){
    assert.ok(data);
});

endpoints.DELETE({url: 'tweet'}, {}, function(err, data){
    assert.ok(data);
});

endpoints.homepage({url: 'tweet'}, {}, function(err, data){
    assert.ok(data);
});
