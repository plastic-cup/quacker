var quacksert = require('./quacksert');
var assert = require('assert');

quacksert(function(){console.log('bye');}, true);
quacksert(function(){console.log('bye');}, true);
quacksert.async(function(){console.log('hi');});

quacksert.run();
