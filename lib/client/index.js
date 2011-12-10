var $ = require('jquery'),
    io = require('socket.io'),
    views = require('./views');

var socket = io.connect(window.location.origin);

window.socket = socket;

$(function () {
    console.log('rawrrrrrrrrrrrr');
});
$(function () {
    //var home_page = new views.HomePage();
    var home = new views.HomePage();
    //exports.home_page.render();
});

/*var $ = require('jquery'),
    _ = require('underscore');*/
//console.log('underscore', require('underscore'));

/*_([1,2,3]).each(function (n) {
    console.log('loopin', n);
});*/
