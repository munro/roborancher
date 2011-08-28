var TILES = {
    CONVEYOR_DOWN: { code: 'd', index: 1, image: 'conveyor-down.png' },
    CONVEYOR_FAST_DOWN: { code: 'fd', index: 2, image: 'conveyor-fast-down.png' },
    CONVEYOR_FAST_LEFT: { code: 'fl', index: 3, image: 'conveyor-fast-left.png' },
    CONVEYOR_FAST_RIGHT: { code: 'fr', index: 4, image: 'conveyor-fast-right.png' },
    CONVEYOR_FAST_RIGHT_DOWN: { code: 'frd', index: 5, image: 'conveyor-fast-right-down.png' },
    CONVEYOR_FAST_DOWN_LEFT: { code: 'fdl', index: 6, image: 'conveyor-fast-down-left.png' },
    CONVEYOR_FAST_UP_RIGHT: { code: 'fur', index: 7, image: 'conveyor-fast-up-right.png' },
    CONVEYOR_FAST_LEFT_UP: { code: 'flu', index: 8, image: 'conveyor-fast-left-up.png' },
    CONVEYOR_FAST_UP: { code: 'fu', index: 9, image: 'conveyor-fast-up.png' },
    CONVEYOR_LEFT: { code: 'l', index: 10, image: 'conveyor-left.png' },
    CONVEYOR_RIGHT: { code: 'r', index: 11, image: 'conveyor-right.png' },
    CONVEYOR_TURN_RIGHT_DOWN: { code: 'rd', index: 12, image: 'conveyor-right-down.png' },
    CONVEYOR_TURN_DOWN_LEFT: { code: 'dl', index: 13, image: 'conveyor-down-left.png' },
    CONVEYOR_TURN_UP_RIGHT: { code: 'ur', index: 14, image: 'conveyor-up-right.png' },
    CONVEYOR_TURN_LEFT_UP: { code: 'lu', index: 15, image: 'conveyor-left-up.png' },
    CONVEYOR_UP: { code: 'u', index: 16, image: 'conveyor-up.png' },
    FLAG: { code: 'f', index: 17, image: 'flag.png' },
    FLOOR: { code: '.', index: 18, image: 'floor.png' },
    PIT: { code: 'p', index: 19, image: 'pit.png' },
    REPAIR: { code: '+', index: 20, image: 'repair.png' },
    ROTATE_ONCE_CCW: { code: 'o', index: 21, image: 'rotate-once-ccw.png' },
    ROTATE_ONCE_CW: { code: 'o-', index: 22, image: 'rotate-once-cw.png' },
    ROTATE_TWICE_CCW: { code: 'ot', index: 23, image: 'rotate-twice-ccw.png' },
    ROTATE_TWICE_CW: { code: 'ot-', index: 24, image: 'rotate-twice-cw.png' },
    WALL_BOTTOM: { code: 'wb', index: 25, image: 'wall-bottom.png' },
    WALL_LEFT: { code: 'wl', index: 26, image: 'wall-left.png' },
    WALL_RIGHT: { code: 'wr', index: 27, image: 'wall-right.png' },
    WALL_TOP: { code: 'wt', index: 28, image: 'wall-top.png' },
    CONVEYOR_FAST_RIGHT_UP: { code: 'fru', index: 29, image: 'conveyor-fast-right-up.png' },
    CONVEYOR_FAST_DOWN_RIGHT: { code: 'fdr', index: 30, image: 'conveyor-fast-down-right.png' },
    CONVEYOR_FAST_UP_LEFT: { code: 'ful', index: 31, image: 'conveyor-fast-up-left.png' },
    CONVEYOR_FAST_LEFT_DOWN: { code: 'fld', index: 32, image: 'conveyor-fast-left-down.png' },
    CONVEYOR_RIGHT_UP: { code: 'ru', index: 29, image: 'conveyor-right-up.png' },
    CONVEYOR_DOWN_RIGHT: { code: 'dr', index: 30, image: 'conveyor-down-right.png' },
    CONVEYOR_UP_LEFT: { code: 'ul', index: 31, image: 'conveyor-up-left.png' },
    CONVEYOR_LEFT_DOWN: { code: 'ld', index: 32, image: 'conveyor-left-down.png' },
};

var BOARD_WIDTH = 20;
var BOARD_HEIGHT = 10;
var TILE_PIXELS = 45;

var MAP = [
    '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  ',
    '.  .  .  . ur  r  r  r  r  r  r  r  r  r  r rd  .  .  .  .  ',
    '.  .  .  .  u  p  .  .  .  .  .  .  .  .  p  d  .  .  .  .  ',
    '.  .  .  .  u  .  p ld  l  l  l  l ul  p  .  d  .  .  .  .  ',
    '.  .  .  .  u  .  .  d  .  .  .  .  u  .  .  d  .  .  .  .  ',
    '.  .  .  .  u  .  .  d  .  .  .  .  u  .  .  d  .  .  .  .  ',
    '.  .  .  .  u  .  p dr  r  r  r  r ru  p  .  d  .  .  .  .  ',
    '.  .  .  .  u  p  .  .  .  .  .  .  .  .  p  d  .  .  .  .  ',
    '.  .  .  . lu  l  l  l  l  l  l  l  l  l  l dl  .  .  .  .  ',
    '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  ',
];

function getTileImage(tileCode) {
    for(var key in TILES) {
        if (TILES[key].code === tileCode)
            return TILES[key].image;
    }
}

function renderMap(map) {
    var html = '';
    for (var x = 0; x < BOARD_WIDTH; x += 1) {
        for (var y = 0; y < BOARD_HEIGHT; y += 1) {
            var tile_x = x * TILE_PIXELS, tile_y = y * TILE_PIXELS;
            var image = getTileImage(map[y].split(/ +/)[x]);
            html += '<div style="border: 0px; background: url(/assets/tiles/' + image 
                    + '); margin-left:' + tile_x + 'px;margin-top:' + tile_y + 'px"></div>';
        }
    }
    $('#board .tiles').html(html);
}


require({
    paths: {
        'events': '../../js/events'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
}, ['events'], function (events) {
    renderMap(MAP);
    console.log('main!!!', events);
    $('#game').show();
    $('#home').hide();
    $('#home-to-lobby').hide();
    return;
    
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
        var spinner = new Spinner({
            lines: 12, // The number of lines to draw
            length: 7, // The length of each line
            width: 2, // The line thickness
            radius: 10, // The radius of the inner circle
            color: '#000', // #rbg or #rrggbb
            speed: 1, // Rounds per second
            trail: 100, // Afterglow percentage
            shadow: true // Whether to render a shadow
        }).spin($('#home-to-lobby .spinner')[0]);
        socket.emit('host', $('#your_name').val(), function (err, room) {
            spinner.stop();
            if (err) {
                $('#home-to-lobby').hide();
                $('#home').hide();
                return alert(err);
            }
            $('#home-to-lobby').hide();
            $('#lobby').show();
            lobbyUpdate(room);
        });
    });

    /* Lobby */
    $('#share_link').click(function () {
        $(this).select();
    });
    
    function lobbyUpdate(room) {
        console.log('ROOOM', room);
        $('#share_link').val(window.location.origin + '/#/game/' + room.key);
        window.location.hash = '/game/' + room.key;
        room.clients.forEach(function (client) {
            $('#lobby .players').append(
                $('<tr />')
                    .append($('<td class="name" />').html(client.name))
                    .append($('<td class="ready" />').html('ready'))
                    .append($('<td class="kick" />').html('kick'))
            );
        });
    };

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
