var connect = require('connect'),
    io = require('socket.io-connect'),
    nko = require('nko')('BB3sRa2b2FOSfcCw');

// Start connect
var server = connect(
    connect.static(__dirname + '/public'),
    connect.directory(__dirname + '/public')
)
server.listen(7777);
console.log('Listening on 7777');

// Start socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
});
