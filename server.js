var connect = require('connect'),
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

server.listen(process.env.NODE_ENV === 'production' ? 80 : 7777, function() {
  console.log('Server Ready');

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0)
    require('fs').stat(__filename, function(err, stats) {
      if (err) return console.log(err)
      process.setuid(stats.uid);
    });
});

// Start socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
});
