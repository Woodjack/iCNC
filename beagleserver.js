// *********************************************************************
//     WEB SERVER HOSTING /web dir
//
var sockets = require('./jsLibrary/beagleSockets.js')
var express = require('express');
var app = express();
var server = require('http').Server(app);

server.listen(8000);
console.log('express webserver listening on port: 8000')

app.use('/static', express.static(__dirname + '/web'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});
