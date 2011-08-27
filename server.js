var connect = require('connect'), 
    nko = require('nko')('BB3sRa2b2FOSfcCw'),
    Cookies = require('cookies'),
    github = require('./github');

function redirect(res, urlString) { 
    res.writeHead(302, {
        'Location': urlString
    });
    res.end();
}

function completeAuthentication(req, res) {
    cookies = new Cookies(req, res);
    cookies.set('authenticated', 'true', { httpOnly: false });
    cookies.set('username', req.session.username, { httpOnly: false });

    redirect(res, '/client.html');
}

function authenticate(req, res, next) {
    if (req.session.accessToken && req.session.username)
        completeAuthentication(req, res);
    else
        github.handleAuthentication(req, res, next, function(accessToken) {
            github.getUserInfo(accessToken, function(username) {
                req.session.accessToken = accessToken;
                req.session.username = username;

                completeAuthentication(req, res);
            });
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
    socket.emit('login', {hello: 'world'});
});
