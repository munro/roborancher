var StateGraph = require('./structures/StateGraph');

function Player(client) {
    var that = this;
    this.client = client;
    this.state = new StateGraph();
    this.ready = false;

    client.socket.on('chat_message', function (message) {
        that.game.players.forEach(function () {
            this.client.socket.emit('chat_message', that.client, message);
        });
    });

    client.socket.on('disconnect', function () {
        that.state.end();
        that.game.playerLeave(player);
    });

    this.state.state('lobby_host', function () {
        that.client.socket.on('start_game', (this.start_game = function (callback) {
            if (this.game.canStart()) {
                this.game.start();
            } else {
                callback('Cannot start the game.');
            }
        }));
        that.client.socket.on('kick_player', (this.kick_player = function (player) {
            this.game.kickPlayer(player);
        }));
    }).on('end', function () {
        that.client.socket.removeListener('start_game', this.start_game);
        that.client.socket.removeListener('kick_player', this.kick_player);
    });

    this.state.state('lobby_player', function () {
        that.client.socket.on('ready', (this.ready = function (value) {
            this.ready = (value === true);
        }));
    }).on('end', function () {
        that.client.socket.removeListener('ready', this.ready);
    });

    this.state.state('turn', function () {
        that.client.socket.on('lock_cards', (this.lock_cards = function (cards) {
        }));
    }).on('end', function () {
        that.client.socket.removeListener('lock_cards', this.lock_cards);
    });

    this.state.state('waiting', function () {
        // do do do
    }).on('end', function () {
    });
}

function Game(player) {
    var that = this;
    this.host = player;
    this.players = [player];
    this.state = new StateGraph();

    this.state.state('lobby', function () {
    }).on('end', function () {
    });

    this.state.state('pre_turn', function () {
        this.timer = setTimeout(function () {
        }, 1000);
    }).on('end', function () {
        clearTimeout(this.timer);
    });

    this.state.state('turn', function () {
    }).on('end', function () {
    });

    this.state.state('execution', function () {
    }).on('end', function () {
    });

    this.state.state('game_over', function () {
    }).on('end', function () {
    });
}

Game.prototype.kickPlayer = function (player) {
};

Game.prototype.addClient = function (client) {
};

Game.prototype.playerLeave = function (player) {
    this.players = this.players.filter(function (v) {
        return v !== player;
    });

    if (this.state.current === 'lobby') {
        if (this.players.length === 0) {
            return this.endGame();
        }

        if (this.host === player) {
            this.host = this.players[0];
            this.host.state.go('lobby_host');
        }
    } else if (this.players.length === 1) {
        this.endGame();
    }
};

Game.prototype.endGame = function () {
};

function generateKey() {
    var key = '';
    for (var i = 0; i < 5; i += 1) {
        key += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return key;
}

Game.games = {};

Game.createGame = function (client) {
    var key;
    // find new room
    while (key = generateKey()) {
        if(!Game.games.hasOwnProperty(key)) {
            break;
        }
    }
    // create room!
    Game.games[key] = new Game(client, key);
    return Game.games[key];
};

module.exports = Game;
