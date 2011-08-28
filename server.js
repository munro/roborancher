var connect = require('connect'), 
    nko = require('nko')('BB3sRa2b2FOSfcCw'),
    github = require('./github'),
    Client = require('./lib/server/Client');

// Start connect
var server = connect(
    connect.cookieParser(),
    connect.session({ secret: 'my lungs are full of bees' }),
    connect.router(function(app) {
        github.route(app);
    }),
    connect.static(__dirname + '/public'),
    connect.directory(__dirname + '/public')
)

server.listen(process.env.NODE_ENV === 'production' ? 80 : 7777, function() {
    console.log('Server Ready');

    // if run as root, downgrade to the owner of this file
    if (process.getuid() === 0) {
        require('fs').stat(__filename, function(err, stats) {
            if (err) return console.log(err);
            process.setuid(stats.uid);
        });
    }
});

// Start socket.io
var codes = {};
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    Client.join(socket);
});
