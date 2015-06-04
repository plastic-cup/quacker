var http = require("http"),
    endpoints = require("./endpoints.js");

http.createServer(function(req, res){
    var root = req.method,
        endpoint = endpoints[root];

    if (req.url.length === 1){
        endpoints.homepage(req, res, function(err, data){
            if (err){
                res.end(err);
            } else {
                res.end(data);
            }
        });
    } else if (req.url.indexOf('foo') > -1) {
      endpoints.FOO(req, res, function(err, data){return;});
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
