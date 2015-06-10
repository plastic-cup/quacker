var http = require("http"),
    fs = require('fs'),
    express = require("./index.js");
    endpoints = require("./endpoints");
    port = process.env.PORT || 8000;
    app = express();

http.createServer(app).listen(port);

app.route('/ GET', endpoints.homepage);
app.route('/ GET', endpoints['/main GET']);

app.route('/main GET', endpoints['/main GET']);
app.route('/main GET', errorHandler);

app.route('/main POST', endpoints['/main POST']);
app.route('/main POST', errorHandler);

app.route('/main DELETE', endpoints['/main DELETE']);
app.route('/main DELETE', errorHandler);

app.route('generic', endpoints.default);
app.route('generic', errorHandler);


function errorHandler(err, request, response, next){
    console.error(err);
    response.writeHead(500);
    response.end(err.toString());
}
