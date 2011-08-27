var connect = require('connect'),
    io = require('socket.io-connect'),
    nko = require('nko')('BB3sRa2b2FOSfcCw');

var github = require('./github');

function redirect(res, urlString) { 
    res.writeHead(302, {
        'Location': urlString
    });
    res.end();
}

function authenticate(req, res, next) {
    if (req.session.accessToken)
        redirect(res, '/client.html');
    else
        github.handleAuthentication(req, res, next, function(accessToken) {
            req.session.accessToken = accessToken;
            redirect(res, '/client.html');
        });
}

// Start connect
var server = connect(
    connect.cookieParser(),
    connect.session({ secret: 'my lungs are full of bees' }),
    connect.static(__dirname + '/public'),
    connect.directory(__dirname + '/public'),
    connect.router(function(app) {
        app.get('/authenticate', authenticate);
    })
)
server.listen(7777);
console.log('Listening on 7777');

// Start socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
});
