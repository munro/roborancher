var connect = require('connect'), 
    nko = require('nko')('BB3sRa2b2FOSfcCw'),
    github = require('./github');

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
    socket.emit('client_id', github.client_id);
    socket.on('login', function (code, callback) {
        var access_token = codes[code];
        function post_token() {
            if (!access_token) {
                callback('Session has expired');
            }
            github.getUserInfo(access_token, function (data) {
                if (!data) {
                    callback('No data...');
                } if (data.error) {
                    callback(data.error);
                } else if (!data.user || !data.user.login) {
                    callback('Could not get login name');
                } else {
                    callback(false, data.user.login);
                }
            });
        }
        if (!access_token) {
            github.getAccessToken(code, function (data) {
                access_token = data;
                post_token();
            });
        } else {
            post_token();
        }
    });
});
