require({
    paths: {
        'events': '../../js/events'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
}, ['events'], function (events) {
    var html = '';
    for (var x = 0; x < 20; x += 1) {
        for (var y = 0; y < 10; y += 1) {
            var tile_x = x * 45, tile_y = y * 45;
            html += '<div style="margin-left:' + tile_x + 'px;margin-top:' +
                    tile_y + 'px"></div>';
        }
    }
    $('#board').html(html);
    console.log('main!!!', events);

    var socket = io.connect(window.location.origin);

    /* Host game */
    $('#home button').click(function () {
        $('#your_name').val($('#your_name').val().trim().substr(0, 20));
        if ($('#your_name').val() === '') {
            alert('Please enter a name, biatch!');
            $('#your_name').focus();
            return;
        }
        $('#home').hide();
        $('#home-to-lobby').show();
        var opts = {
            lines: 12, // The number of lines to draw
            length: 7, // The length of each line
            width: 2, // The line thickness
            radius: 10, // The radius of the inner circle
            color: '#000', // #rbg or #rrggbb
            speed: 1, // Rounds per second
            trail: 100, // Afterglow percentage
            shadow: true // Whether to render a shadow
        };
        var spinner = new Spinner(opts).spin($('#home-to-lobby .spinner')[0]);
        /*socket.emit('host', $('#your_name').val(), function (game_id) {
        });*/
    });

return;

    socket.on('client_id', function (client_id) {
        console.log('client', client_id);
        $('#login button').click(function () {
            window.location = 'https://github.com/login/oauth/authorize?client_id=' +
                    client_id;
        });
    });

    // Login!
    var code, match = window.location.search.match(/code=([A-Za-z\d]+)/);
    if (match && match[1]) {
        code = match[1];
        $.cookie('code', code);
    } else {
        code = $.cookie('code')
    }

    if (!code) {
        $('#login').show();
    } else {
        socket.emit('login', code, function (err, account) {
            console.log(arguments);
            if (err) {
                alert(err);
                $('#login').show();
                $.cookie('code', null);
            } else {
                $('#game').show();
            }
        });
    }
});
