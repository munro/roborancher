// todo: move to a common area, it's duplicated on the server
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
    CONVEYOR_RIGHT_UP: { code: 'ru', index: 33, image: 'conveyor-right-up.png' },
    CONVEYOR_DOWN_RIGHT: { code: 'dr', index: 34, image: 'conveyor-down-right.png' },
    CONVEYOR_UP_LEFT: { code: 'ul', index: 35, image: 'conveyor-up-left.png' },
    CONVEYOR_LEFT_DOWN: { code: 'ld', index: 36, image: 'conveyor-left-down.png' },
};

var COMPASS_TO_DIR = {
    'north': 'up',
    'east': 'right',
    'south': 'down',
    'west': 'left'
};

var PLAYER_TO_COLOR = {
    '1': 'blue',
    '2': 'green',
    '3': 'red',
    '4': 'orange'
};

var BOARD_WIDTH = 20;
var BOARD_HEIGHT = 10;
var TILE_PIXELS = 45;

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
            html += '<div style="background: url(/assets/tiles/' + image 
                    + '); margin-left:' + tile_x + 'px;margin-top:' + tile_y + 'px"></div>';
        }
    }
    $('#board .tiles').html(html);
}

var clients = {};

function updatePlayers(players) {
    clients = players;
    console.log('clients', clients);
    $('#game .players tbody tr').children().remove();
    var bot_html = '';
    players.forEach(function(player) {

        var image = '/assets/bots/robot-' + COMPASS_TO_DIR[player.direction] +
                '-' + PLAYER_TO_COLOR[player.player] + '.png';
        var tr = $('<tr />')
            .append($('<td class="icon" />')
                .append($('<img />').attr('src', image))
            )
            .append($('<td class="name" />').text(player.name))
            .append($('<td class="icon" />').text(4));
        $('#game .players tbody').append(tr);
        if (player.owned) {
            tr.addClass('self');
        }
        bot_html += '<div id="bot-' + player.player + '" style="background: url(' + image + 
                '); margin-left:' + (player.position[0] * 45) +
                'px;margin-top:' + ((9 - player.position[1]) * 45) + 'px"></div>';
    });
    console.log(bot_html);
    $('#board .bots div').remove();
    $('#board .bots').html(bot_html);
}

var loader = {
    show: function (message) {
        $('#loading').show();
        $('#loading .description').text(message);
        loader.spinner = new Spinner({
            lines: 12, // The number of lines to draw
            length: 7, // The length of each line
            width: 2, // The line thickness
            radius: 10, // The radius of the inner circle
            color: '#000', // #rbg or #rrggbb
            speed: 1, // Rounds per second
            trail: 100, // Afterglow percentage
            shadow: true // Whether to render a shadow
        }).spin($('#loading .spinner')[0]);
    },
    hide: function () {
        $('#loading').hide();
        loader.spinner.stop();
    }
};

var socket = io.connect(window.location.origin);

$(function () {
    var changing_hash = false;
    function changeHash(value) {
        changing_hash = true;
        window.location.hash = value;
        setTimeout(function () {
            changing_hash = false;
        }, 50);
    }
    $(window).hashchange(function () {
        if (!changing_hash) {
            location.reload();
        }
    });

    function joinGame(game_key) {
        smoke.prompt('Enter your name', function (name) {
            name = String(name || '');
            name = name.trim().substr(0, 20);
            console.log('WTF', name);
            $.cookie('name', name);
            $('#home, #game, #chat, #lobby').hide();
            loader.show('Attempting to join game...');
            socket.emit('join', game_key, name, function (err, room) {
                loader.hide();
                if (err) {
                    changeHash('');
                    $('#home').show();
                    console.log('errrrrrrr');
                    return smoke.signal(err);
                }
                $('#lobby').show();
                $('#chat').show();
                lobbyUpdate(room);
            });
        });
        setTimeout(function () {
            $('.dialog-prompt input').val($.cookie('name')).attr('maxlength', 20);
        }, 10);
    }
    var match = window.location.hash.match(/^#\/game\/([A-Za-z]{5})$/);
    if (match && match[1]) {
        var game_key = match[1].toUpperCase();
        joinGame(game_key);
    } else {
        changeHash('');
    }


    $('#your_name').val($.cookie('name'));
    /* Host game */
    $('#home .host').click(function () {
        $('#your_name').val($('#your_name').val().trim().substr(0, 20));
        $.cookie('name', $('#your_name').val());
        if ($('#your_name').val() === '') {
            smoke.signal('Please enter a name!');
            $('#your_name').focus();
            return;
        }
        $('#home').hide();
        loader.show('Game is instantiating, please wait!');

        socket.emit('host', $('#your_name').val(), function (err, room) {
            loader.hide();
            if (err) {
                return smoke.signal(err);
            }
            $('#lobby').show();
            $('#chat').show();
            lobbyUpdate(room);
        });
    });
    
    $('#home .join').click(function () {
        var match = $('#join_game').val().match(/^([A-Za-z]{5})$/);
        var game_key = '';
        if (match && match[1]) {
            game_key = match[1].toUpperCase();
            joinGame(game_key);
            $('#join_game').val('');
        } else {
            $('#join_game').val('');
            return smoke.signal('Invalid game key, must be 5 letters.');
        }
    });

    /* Lobby */
    $('#share_link').click(function () {
        $(this).select();
    });
    
    socket.on('update_lobby', function (room) {
        lobbyUpdate(room);
    });

    /***** GAME LOGIC *****/
    socket.on('start_game', function (gameInfo) {
        console.log('starting game');
        renderMap(gameInfo.map);
        updatePlayers(gameInfo.roomInfo.clients);
        $('#lobby').hide();
        $('#chat').show();
        $('#game').show();
        $('#my_hand').hide();
        $('#registers_done').hide();
    });

    socket.on('update_flags', function (flags) {
        var html = '';
        flags.forEach(function (flag) {
            html += '<div style="background-image:url(/assets/tiles/flag.png); margin-left:' +
                (flag.position[0] * 45) + 'px;margin-top:' +
                ((9 - flag.position[1]) * 45) + 'px></div>';
        });
    });

    /* get ready */
    var start_timer;
    socket.on('start_round', function (seconds) {
        console.log('starting_round');
        $('#my_registers .card').remove();
        $('#my_hand .card').remove();
        function setStatus(seconds) {
            $('#game .hand .message').text('Get ready to set your registers!  In ' +
                seconds + ' second' + (seconds === 1 ? '' : 's') + '...');
        }
        setStatus(seconds);
        clearInterval(start_timer);
        start_timer = setInterval(function () {
            seconds -= 1;
            if (seconds > 0) {
                setStatus(seconds);
            } else {
                clearInterval(start_timer);
                $('#game .hand .message').text('Get ready to set your registers!');
            }
        }, 1000);
    });

    socket.on('deal_cards', function (hand) {
        $('#game .hand .message').text('Place your registers in the order you want your robot to move.');
        clearInterval(start_timer);
        $('#my_hand li').remove();
        $('#my_hand').show();
        $('#registers_done').show();
        $('#registers_done').attr('disabled', 'disabled');
        for (var i = 0; i < 8; i += 1) {
            (function (i) {
                var card = hand[i];
                var image = '/assets/cards/' + card.action + '-' +
                        card.magnitude + '.png';
                var hand_slot = $('<li />');
                hand_slot.appendTo($('#my_hand'));
                hand_slot.append(
                    $('<div class="card"/>')
                        .css('background', 'url(' + image + ')')
                        .data('hand', i)
                        .draggable({
                            start: function (event, ui) {
                                var offset = $(this).parent().offset();
                                $(this).css('margin-top', offset.top).css('margin-left', offset.left).css('z-index', 9001).appendTo($('#my_cards'));
                            },
                            stop: function (event, ui) {
                                $(this).css('margin', '0').css('margin-left', '0px').css('top', 0).css('left', 0).css('z-index', 1);
                                if ($('.card:first').parent().attr('id') === 'my_cards') {
                                    $(this).appendTo(hand_slot);
                                }
                                $('#my_registers li').css('background-image', 'url(/assets/cards/empty.png)');
                                if ($('#my_registers .card').length === 5) {
                                    $('#registers_done').removeAttr('disabled');
                                } else {
                                    $('#registers_done').attr('disabled', '');
                                }
                            }
                        })
                );
            }(i));
        }
        for (var i = 0; i < 5; i += 1) {
            (function (i) {
                var register = $($('#my_registers li')[i]);
                $('#my_registers li').droppable({
                    over: function (event, ui) {
                        $(this).css('background-image', 'url(/assets/cards/place.png)');
                    },
                    out: function (event, ui) {
                        $(this).css('background-image', 'url(/assets/cards/empty.png)');
                    },
                    drop: function (event, ui) {
                        if ($(this).children().length === 0) {
                            ui.draggable.appendTo($(this));
                        }
                    }
                });
            }(i));
        }
    });
    
    $('#registers_done').click(function () {
        console.log('rawrrrrr');
        socket.emit('registers_done', $.makeArray($('#my_registers li').map(function () {
            return $(this).find('.card').data('hand') || false;
        })));
        $('#my_registers .card').draggable('destroy');
        $('#my_registers li').droppable('destroy');
        $('#registers_done').hide();
        $('#my_hand').hide();
        $('#game .hand .message').text('Your registers have been locked!');
    });

    var deal_timer;
    socket.on('deal_timer', function (seconds) {
        function setStatus(seconds) {
            if ($('#registers_done:visible').length === 0) {
                $('#game .hand .message').text('Your registers have been locked!  Waiting ' +
                        seconds + ' second' + (seconds === 1 ? '' : 's') +
                        ' for other players to lock in...');
            } else {
                $('#game .hand .message').text('Someone has locked in!  You have ' +
                        seconds + ' second' + (seconds === 1 ? '' : 's') +
                        ' to set your registers.');
            }
        }
        setStatus(seconds);
        clearInterval(deal_timer);
        deal_timer = setInterval(function () {
            seconds -= 1;
            if (seconds > 0) {
                setStatus(seconds);
            } else {
                clearInterval(deal_timer);
                $('#game .hand .message').text('Your registers have been locked!');
            }
        }, 1000);
    });
    
    socket.on('lock_registers', function (registers) {
        clearInterval(deal_timer);
        $('#game .hand .message').text('Your registers have been locked!');
        $('#my_hand').hide();
        $('#my_hand .card').draggable('destroy').remove();
        $('#my_registers .card').draggable('destroy').remove();
        $('#my_registers li').droppable('destroy');
        console.log('lock_registers', registers);
        registers.forEach(function (card, index) {
            var image = '/assets/cards/' + card.action + '-' +
                    card.magnitude + '.png';
            $($('#my_registers li')[index]).append(
                $('<div class="card"/>')
                    .css('background', 'url(' + image + ')')
                    .data('hand', index)
            );
        });
    });
    
    socket.on('exec_stack', function (stack) {
        console.log('RAWRRRR', stack);
        stack = stack.reverse();
        
        function popStack() {
            var instr = stack.pop();
            if (!instr) {
                $('#my_registers .card').remove();
                return;
            }
            var image = '/robot-' + COMPASS_TO_DIR[instr.direction] +
                    '-' + PLAYER_TO_COLOR[instr.client] + '.png';
            var bot = $('#bot-' + instr.client);
            console.log(image, bot.css('background-image'));
            if (bot.css('background-image').indexOf(image) === -1) {
                console.log('rotate', image);
                bot.fadeOut(250, function () {
                    bot.css('background-image', 'url(/assets/bots' + image + ')');
                    bot.fadeIn(250, function () {
                        popStack();
                    });
                });
            } else {
                console.log('move');
                bot.animate({
                    marginLeft: (instr.position[0] * 45) + 'px',
                    marginTop: ((9 - instr.position[1]) * 45) + 'px'
                }, {
                    duration: 500,
                    easing: 'linear',
                    complete: function () {
                        popStack();
                    }
                });
            }
            if (instr.card && clients.some(function (client) {
                return client.owned &&
                        instr.client == client.player; // yes weak typing
            })) {
                $('#my_registers .card:first').fadeOut(500, function () {
                    $(this).remove();
                });
            }
        }
        popStack();
    });
    
    function lobbyUpdate(room) {
        console.log('ROOOM', room);
        $('#share_link').val(window.location.origin + '/#/game/' + room.key);
        changeHash('/game/' + room.key);
        $('#lobby .players tr').remove();
        room.clients.forEach(function (client) {
            $('#lobby .players').append(
                $('<tr />')
                    .append($('<td class="name" />').text(client.name))
                    .append($('<td class="ready" />').text('ready'))
                    .append($('<td class="kick" />').text('kick'))
            );
        });
    };
    
    $('#start_game').click(function () {
        $('#lobby').hide();
        $('#chat').show();
        loader.show('Game is starting.  Please wait, sir.');
        socket.emit('start_game', function (err) {
            loader.hide();
            if (err) {
                $('#home').show();
                return smoke.signal(err);
            }
        });
    });
    $('#kick').click(function(){
        smoke.signal('ok');
    });
    
    /***** Chat *****/
    function sendChatMessageToServer() {
        var msg = $('#chat .your_message input').val().trim();
        $('#chat .your_message input').val('');
        if (msg !== '')
            socket.emit('chat_message_from_client', msg);
    };
    
    socket.on('chat_message_from_server', function(player, msg) {
        console.log(player);
        var div = $('<div />')
                .append($('<span class="pre">&lt;</span>'))
                .append($('<span class="name" />').text(player))
                .append($('<span class="post">&gt; </span>'))
                .append($('<span class="message" />').text(msg));
        $('#chat .messages').append(div);
        $('#chat .messages').scrollTop($('#chat .messages')[0].scrollHeight);
    });
    
    $('#chat .your_message button').click(function() {
        sendChatMessageToServer();
    });

    $('#chat .your_message input').keypress(function(event) {
        if(event.which == 13)
            sendChatMessageToServer();
    });
});
