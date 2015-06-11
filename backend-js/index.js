// express stuff
var url = require('url'),
    http = require('http'),
    endpoints = require("./endpoints.js"),
    routing = require("./routing.js");


function express(){
    var middlewareStore = [];

	 function app(request, response){
        app.handle(request, response, routing(request));
   }

    app.route = function(path, fn){
        app[path] = app[path] || {};
        app[path].store = app[path].store || [];
        app[path].store.push(fn);
    };

    app.use = function (fn){
	      middlewareStore.push(fn);
    };

  	app.handle = function (request, response, path){
	  	var index = 0;
        var that = app[path] && app[path].store ? app[path] : app.generic;
        var store = middlewareStore;

	  	  function runner(err) {
            var lay = store[index];
            if (!lay){
                if (store === middlewareStore){
                  index = 0;
                  store = this.store;
                  next();
                }
            return;
            }
            index++;
            if (err && lay.length < 4) {
                next(err);
            } else if (err){
                lay(err, request, response, next);
            } else if (lay.length > 3) {
                next();
            } else {
                lay(request, response, next);
            }
        }

        next = runner.bind(that);
        next();
	  };
	  return app;
}

module.exports = express;
