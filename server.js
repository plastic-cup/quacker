var http = require("http"),
    express = require("./index.js");

http.createServer(express()).listen(8000);
