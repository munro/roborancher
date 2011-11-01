// Auto restart server on file changes
(function () {
    var fs = require('fs'),
        original = require.extensions['.js'];

    function exitOnChange(filename) {
        fs.watchFile(filename, function (curr, prev) {
            if (curr.mtime !== prev.mtime) {
                process.exit();
            }
        });
    }
    
    require.extensions['.js'] = function (options) {
        exitOnChange(options.filename);
        original.apply(this, arguments);
    };

    exitOnChange(require.main.filename);
}());

console.log('');
console.log('---- Starting server ----');

var connect = require('connect'), 
    Client = require('./lib/Client'),
    path = require('path');

// Start connect
var server = connect(
    require('browserify')({
        mount: '/roborancher.js',
        entry: path.join(__dirname, 'lib/client/index.js'),
        require: [
            'underscore',
            {'socket.io': 'socket.io-client'},
            {backbone: 'backbone-browserify'},
            {jquery: 'jquery-browserify'}
        ],
        watch: true
    }),
    connect.static(__dirname + '/public'),
    connect.directory(__dirname + '/public')
);

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

//require('repl').start();
