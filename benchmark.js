var io = require('socket.io-client');

var SERVER = 'http://0x0539.nko2.nodeknockout.com';
var CLIENTS = 50;

function SocketIOClient(host, details) {
    var uri = io.util.parseUri(host), uuri, socket;

    if (typeof document !== 'undefined') {
        uri.protocol = uri.protocol || document.location.protocol.slice(0, -1);
        uri.host = uri.host || document.domain;
        uri.port = uri.port || document.location.port;
    }

    uuri = io.util.uniqueUri(uri);

    var options = {
        host: uri.host,
        secure: 'https' === uri.protocol,
        port: uri.port || ('https' === uri.protocol ? 443 : 80),
        query: uri.query || ''
    };

    io.util.merge(options, details);

    io.Socket.call(this, options);
}
SocketIOClient.prototype = Object.create(io.Socket.prototype);

(function () {
    var sockets = [];
    var connect_time = +new Date();
    for (var i = 0; i < CLIENTS; i += 1) {
        (function (socket) {
            process.stdout.write('.');
            socket.on('connect', function () {
                sockets.push(socket);
                process.stdout.write('+');
                if (sockets.length === CLIENTS) {
                    console.log(socket[0] === socket[1]);
                    connect_time = (+new Date()) - connect_time;
                    console.log('All %s clients connect in %s ms (%s ms average)', CLIENTS, connect_time, (connect_time / CLIENTS));
                }
            });
            socket.on('disconnect', function () {
                process.stdout.write('+');
            });
        }(new SocketIOClient(SERVER)));
    }
}());

io.connect(SERVER);
