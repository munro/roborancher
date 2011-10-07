var StateGraph = require('./structures/StateGraph'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

function Game(player) {
    var that = this;

    EventEmitter.call(this);
    StateGraph.call(this);

    this.host = player;
    this.players = [player];

    this.state('lobby', function () {
    }).on('end', function () {
    });

    this.state('pre_turn', function () {
        this.timer = setTimeout(function () {
            that.go('turn');
        }, 1000);
    }).on('end', function () {
        clearTimeout(this.timer);
    });

    this.state('turn_wait', function () {
        that.players.on('set_registers', this.set_registers = function (cards) {
            that.go('turn_timer');
        });
    }).on('end', function () {
        that.players.removeListener('set_registers', this.set_registers);
    });

    this.state('turn_timer', function () {
        this.timer = setTimeout(function () {
            that.go('execution');
        }, 12000); // Give players 12 seconds to choose their registers
    }).on('end', function () {
        clearTimeout(this.timer);
    });

    this.state('execution', function () {
        // Randomly choose cards for player here
    }).on('end', function () {
    });

    this.state('game_over', function () {
    }).on('end', function () {
    });

    this.go('lobby');
}

Game.prototype = Object.create(EventEmitter.prototype);
_(Game.prototype).extend(StateGraph.prototype);

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
