var http = require("http"),
    endpoints = require("./endpoints.js");

http.createServer(function(req, res){
    var root,
        endpoint = endpoints[root];

    root = req.url.indexOf('?') > -1 ? req.url.split('?')[0] + " " + req.method : req.url + " " + req.method;

    if (req.url.length === 1){
        endpoints.homepage(req, res, function(err, data){
            if (err){
                res.end(err);
            } else {
                res.end(data);
            }
        });
    } else if (req.url.indexOf('.') > -1){
        endpoints.default(req, res, function(err, data){
            if (err){
                res.end(err.toString());
            } else {
                var ext = req.url.split('.')[1];
                res.writeHead(200, {'Content-Type' : 'text/' + ext});
                res.end(data);
            }
        });
    } else {
        console.log('root is : ' + root);
        endpoints[root](req, res, function(err, data){
            if (err){
                res.end(err);
            } else {
                res.end(data);
            }
        });
    }

}).listen(8000);
