var assert = require('assert');

var testsRunning = 0;
var tests = [];
var assertsOnHold = [];
var waitingAsync = function(){
    if (assertOnHold && testsRunning === 0) assertOnHold();
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
        console.error(e);
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
        quack();
        next();
    });
    tests.push(function(){
        assertOnHold = assertsOnHold[numOnHold - 1]();
        waitingAsync();
    });
};

test.run = function(){
    var index = 0;
    function next(index){
        var check = tests[index];
        if (!check) return;
        index++;
        check(next);
    }
    next();
};

module.exports = test;
