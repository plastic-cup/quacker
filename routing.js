var endpoints = require("./endpoints");

function routing (request, response){
    var forMiddlewareStore = [],
        root,
        endpoint = endpoints[root];

    root = request.url.indexOf('?') > -1 ? request.url.split('?')[0] + " " + request.method : request.url + " " + request.method;

    if (request.url.length === 1){

        forMiddlewareStore.push(function(){
            endpoints.homepage(request, response, function(err, data){
                if (err){
                    response.end(err);
                } else {
                    response.end(data);
                }
            });
        });


    } else if (request.url.indexOf('.') > -1){
        forMiddlewareStore.push(function(){
            endpoints.default(request, response, function(err, data){
                if (err){
                    response.end(err.toString());
                } else {
                    var ext = request.url.split('.')[1];
                    response.writeHead(200, {'Content-Type' : 'text/' + ext});
                    response.end(data);
                }
            });
        });

    } else {
        forMiddlewareStore.push(function(){ // put this function into the middlewareStore
            console.log('root is : ' + root);
            endpoints[root](request, response, function(err, data){
                if (err){
                    response.end(err);
                } else {
                    response.end(data);
                }
            });
        });
    }

    return forMiddlewareStore;
}

module.exports = routing;
