var assert = require('assert');
var endpoints = require('../endpoints.js');

assert.equal(endpoints['GET']({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'BOO');

assert.equal(endpoints['POST']({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');

assert.equal(endpoints['DELETE']({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');

assert.equal(endpoints.homepage({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'YAY');

assert.equal(endpoints.FOO({url: 'tweet'}, {}, function(err, data){
    return err || data;
}), 'FOO');
