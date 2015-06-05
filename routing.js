var endpoints = require("./endpoints");

function routing (request, response){

    var forMiddlewareStore = [],
        root = (request.url.indexOf('?') > -1 ? request.url.split('?')[0] : request.url) + " " + request.method;
        endpoint = endpoints[root];
    return root;

}


module.exports = routing;
