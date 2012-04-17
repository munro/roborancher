/*jslint node: true, newcap: true, nomen: true */

'use strict';

var EventEmitter = require('events').EventEmitter,
    Self = require('self'),
    StateGraph = require('./structures/StateGraph'),
    _ = require('underscore');

/**
 * @constructor Game
 * @inherit EventEmitter
 * @mixin StateGraph
 */
var Game = Self(EventEmitter, {
    initialize: function (self) {
        // Initial parent constructors
        EventEmitter.call(self);
        StateGraph.call(self);

        // Initialize state
        self._players = [];
        self._game = new EventEmitter();
        self._callbacks = [];

        /**
         * Logic for a game of RoboRancher.
         *
         * @stategraph game Game
         */

        /**
         * Waits for 2 or more players to enter ready state, then will procede to
         * the pre_turn phase.
         *
         * @stategraph game
         * @state lobby Lobby
         * @next pre_turn turn_wait
         */
        self.state('lobby', function (lobby) {
            self._game.on('player_ready', lobby.on_ready = function (player) {
                if (self.players().length > 1 && self.playersReady()) {
                    self.go('pre_turn');
                }
            });
        }).on('end', function (lobby) {
            self._game.removeEventListener('player_ready', lobby.on_ready);
        });

        /**
         * Give the players some breathing time inbetween turns.
         *
         * @stategraph game
         * @state pre_turn Pre-turn
         * @next turn_wait
         */
        self.state('pre_turn', function () {
            this.timer = setTimeout(function () {
                self.go('turn_wait');
            }, 1000);
        }).on('end', function () {
            clearTimeout(this.timer);
        });

        /**
         * Wait while players set their registers, when one player locks in,
         * goto the turn_timer state.
         *
         * @stategraph game
         * @state turn_wait Turn wait
         * @next turn_timer
         */
        self.state('turn_wait', function () {
            self.players().on('set_registers', this.set_registers = function () {
                self.go('turn_timer');
            });
        }).on('end', function () {
            self.players().removeListener('set_registers', this.set_registers);
        });
    },
    addPlayer: function (self, player) {
        var fn;
        self._game.emit('player_join', player);
        player.on('ready', fn = function () {
            self._game.emit('player_ready', player);
        });
        self._callbacks.push({player: player, state: 'ready', fn: fn});
    },
    removePlayer: function (self, player) {
        // @TODO This would be simpler if EventEmitter returned slots, and
        //       if there was also a SlotManager object.
        self._callbacks = _(self._callbacks).filter(function (cb) {
            if (cb.player === player) {
                player.removeListener(cb.state, cb.fn);
                return false;
            }
            return true;
        });
    },
    playersReady: function (self) {
        _(self._players).every(function (player) {
            return player.isReady();
        });
    },
    players: function (self) {
        return self._players;
    }
});

Game.mixin(StateGraph.prototype);

/**
 * Generate a random key for games
 */
Game.generateKey = function () {
    var i, key = '';
    for (i = 0; i < 5; i += 1) {
        key += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return key;
};

module.exports = Game;

//if (false) {
//    /*----- old code -----*/
//
//    /**
//     * This is a description
//     *
//     * @constructor Game
//     * @extends EventEmitter
//     */
//    function Game(player) {
//        var that = this;
//
//        EventEmitter.call(this);
//        StateGraph.call(this);
//
//        this.host = player;
//        this.players = [player];
//
//
//
//
//        this.state('turn_timer', function () {
//            this.timer = setTimeout(function () {
//                that.go('execution');
//            }, 12000); // Give players 12 seconds to choose their registers
//        }).on('end', function () {
//            clearTimeout(this.timer);
//        });
//
//        this.state('execution', function () {
//            // Randomly choose cards for player here
//            // that.go('pre_turn');
//        }).on('end', function () {
//        });
//
//        this.state('game_over', function () {
//        }).on('end', function () {
//        });
//
//        this.go('lobby');
//    }
//
//    Game.prototype = Object.create(EventEmitter.prototype);
//    _(Game.prototype).extend(StateGraph.prototype);
//
//    /**
//     * This is a description
//     *
//     * @constructor Game
//     * @prototype kickPlayer
//     * @function
//     */
//    Game.prototype.kickPlayer = function (player) {
//    };
//
//    Game.prototype.addClient = function (client) {
//    };
//
//    Game.prototype.playerLeave = function (player) {
//        this.players = this.players.filter(function (v) {
//            return v !== player;
//        });
//
//        if (this.state.current === 'lobby') {
//            if (this.players.length === 0) {
//                return this.endGame();
//            }
//
//            if (this.host === player) {
//                this.host = this.players[0];
//                this.host.state.go('lobby_host');
//            }
//        } else if (this.players.length === 1) {
//            this.endGame();
//        }
//    };
//
//    Game.prototype.endGame = function () {
//    };
//
//    function generateKey() {
//        var i, key = '';
//        for (i = 0; i < 5; i += 1) {
//            key += String.fromCharCode(65 + Math.floor(Math.random() * 26));
//        }
//        return key;
//    }
//
//    Game.games = {};
//
//    Game.createGame = function (client) {
//        var key;
//        // find new room
//        while ((key = generateKey())) {
//            if(!Game.games.hasOwnProperty(key)) {
//                break;
//            }
//        }
//        // create room!
//        Game.games[key] = new Game(client, key);
//        return Game.games[key];
//    };
//
//}

