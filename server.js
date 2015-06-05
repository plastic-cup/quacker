var http = require("http"),
    fs = require('fs'),
    express = require("./index.js");
    endpoints = require("./endpoints");
    app = express();


http.createServer(app).listen(8000);

app.route('/ GET', endpoints.homepage);
app.route('/ GET', endpoints['/main GET']);
app.use(errorHandler);

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

setInterval(function(){
    fs.writeFile(__dirname + '/quax.json', JSON.stringify(endpoints.quax));
},1000);
