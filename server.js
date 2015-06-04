var http = require("http"),
    endpoints = require("./endpoints.js");

http.createServer(function(req, res){
    var root = req.url + " " + req.method,
        endpoint = endpoints[root];

    if (req.url.length === 1){
        endpoints.homepage(req, res, function(err, data){
            if (err){
                res.end(err);
            } else {
                res.end(data);
            }
        });
    } else {
        endpoint(req, res, function(err, data){
            if (err){
                res.end(err);
            } else {
                res.end(data);
            }
        });
    }

}).listen(8000);
