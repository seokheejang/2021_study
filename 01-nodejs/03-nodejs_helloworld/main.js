var http = require('http');

var server = http.createServer(function(req, res) {
  res.end("Hello, World!");
});
server.listen(3000, console.log("Server listen"));