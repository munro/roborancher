var GITHUB_OAUTH2_CLIENT_ID = '58f4d351561bdf1f004c';
var GITHUB_OAUTH2_SECRET_CODE = 'a300fe946ad8b7720f74cd5048448aede3dc8bf5';

var url = require('url'),
    qs = require('qs'),
    https = require('https');

function redirect(res, urlString) { 
    res.writeHead(302, {
        'Location': urlString
    });
    res.end();
}

function authenticate(req, res, next) {
    if (req.session.accessToken) {
        redirect(res, '/client.html');
    } else {
        handleAuthentication(req, res, next, function(accessToken) {
            req.session.accessToken = accessToken;
            redirect(res, '/client.html');
        });
    }
}

exports.route = function (app) {
    app.get('/', function (req, res) {
        if (req.session.accessToken) {
            return redirect(res, '/client.html');
        } else {
            return redirect(res, '/login.html');
        }
    });
    app.get('/authenticate', authenticate);
};

function makeHTTPSRequest(urlString, callback) {
    var siteUrl = url.parse(urlString);

    var options = {
        host: siteUrl.host,
        port: siteUrl.port || 443,
        path: siteUrl.pathname + siteUrl.search,
        method: 'GET'
    };

    var request = https.request(options, callback);
    request.end();
}

function getAccessToken(authCode, callback) {
    var ghUrl = 'https://github.com/login/oauth/access_token?code=' + authCode 
            + '&client_secret=' + GITHUB_OAUTH2_SECRET_CODE 
            + '&client_id=' + GITHUB_OAUTH2_CLIENT_ID;

    makeHTTPSRequest(ghUrl, function(response) {
        var data = '';
        response.on('data', function(chunk) {
            data += chunk;
        });
        response.on('end', function() {
            var accessToken = qs.parse(data).access_token;
            callback(accessToken);
        });
    });
}

function handleAuthentication(req, res, next, callback) {
    params = qs.parse(url.parse(req.url).query);
    accessCode = params.code;
    getAccessToken(params.code, callback);
}

function getUserInfo(accessToken, callback) {
    var ghUrl = 'https://github.com/api/v2/json/user/show?access_token=' + accessToken;

    makeHTTPSRequest(ghUrl, function(response) {
        var jsonData = '';
        response.on('data', function(chunk) {
            jsonData += chunk;
        });
        response.on('end', function() {
            data = JSON.parse(jsonData);
            callback(data['user']['login']);
        });
    });
}

exports.handleAuthentication = handleAuthentication;
exports.getUserInfo = getUserInfo;
