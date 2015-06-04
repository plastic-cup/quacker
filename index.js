// express stuff
var url = require('url'),
    http = require('http'),
    endpoints = require("./endpoints.js"),
    routing = require("./routing.js");


function express(){
	var middlewareStore = [];

	function app(request, response){
        app.routing(request, response); //populates middlewareStore;
		app.handle(request, response);
	}

    app.routing = function(request, response){
        middlewareStore = routing(request, response);
    };


    app.use = function (fn){
		middlewareStore.push(fn);
	};

	app.handle = function (request,response){
		var index = 0;
		function next(){
            		if (middlewareStore.length >= 1){
                		middlewareStore.shift()(request, response, next);
            		}
        	}
		next();
	};
	return app;
}

module.exports = express;

// function next(){
//     if (middlewareStore.length >= 1){
//         middlewareStore.shift()(request, res, next);
//     }
//     next();
// }
