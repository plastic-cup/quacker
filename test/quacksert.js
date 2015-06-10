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

var quack = function(assertionMethod, argumentArray){
    try {
        testsRunning++;
        assertionMethod.apply(null, argumentArray);
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
    var methodArgs = [].slice.call(arguments).slice(1);
    tests.push(function(next){
        next();
        quack(assertionMethod,methodArgs);
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
    setTimeout(function(){errors.forEach(function(error){throw error;});}, 600);
};

module.exports = test;
