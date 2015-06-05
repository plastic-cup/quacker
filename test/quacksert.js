var assert = require('assert');

var testsRunning = 0;
var tests = [];
var errors = [];
var assertOnHold;
var assertsOnHold = [];
var waitingAsync = function(){
    var currAssert;
    if (assertOnHold && testsRunning === 0){
        currAssert = assertOnHold;
        assertOnHold = undefined;
        currAssert();
    }
};

var quack = function(assertionMethod){
    try {
        testsRunning++;
        assertionMethod.apply(null, [].slice.call(arguments).slice(1));
        testsRunning--;
        waitingAsync();
      }
    catch (e) {
        errors.push(e);
        testsRunning--;
        waitingAsync();
    }
};

var test = function(assertionMethod){
    tests.push(function(next){
        next();
        quack(assertionMethod);
    });
};

test.async = function(assertionMethod){

    var numOnHold = assertsOnHold.push(function(next){
        quack(assertionMethod);
        next();
    });

    tests.push(function(next){
        assertOnHold = function(){
            assertsOnHold[numOnHold - 1](next);
        };
        waitingAsync();
        next();
    });

};

test.run = function(){
    var index = 0;
    function next(){
        var check = tests[index];
        if (!check) return;
        index++;
        check(next);
    }
    next();
};

module.exports = test;
