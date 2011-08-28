var GITHUB_OAUTH2_CLIENT_ID =
    process.env.GITHUB_OAUTH2_CLIENT_ID || '58f4d351561bdf1f004c';
var GITHUB_OAUTH2_SECRET_CODE =
    process.env.GITHUB_OAUTH2_SECRET_CODE || 'a300fe946ad8b7720f74cd5048448aede3dc8bf5';

exports.client_id = GITHUB_OAUTH2_CLIENT_ID;

var url = require('url'),
    qs = require('qs'),
    https = require('https'),
    fs = require('fs');

// This should be removed, and the OAuth callback should be to /
exports.route = function (app) {
    app.get('/authenticate', function (req, res) {
        var file = fs.createReadStream(__dirname + '/public/index.html');
        file.pipe(res);
    });
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

exports.getAccessToken = function (authCode, callback) {
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
};

exports.getUserInfo = function (accessToken, callback) {
    var ghUrl = 'https://github.com/api/v2/json/user/show?access_token=' + accessToken;

    makeHTTPSRequest(ghUrl, function(response) {
        var jsonData = '';
        response.on('data', function(chunk) {
            jsonData += chunk;
        });
        response.on('end', function() {
            data = JSON.parse(jsonData);
            callback(data);
        });
    });
};
