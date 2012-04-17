/*jslint node: true, newcap: true, nomen: true */

'use strict';

var EventEmitter = require('events').EventEmitter,
    Self = require('self'),
    StateGraph = require('./structures/StateGraph'),
    _ = require('underscore');

/**
 * @constructor Player
 * @inherit EventEmitter
 * @mixin StateGraph
 */
var Player = Self(EventEmitter, {
    initialize: function (self, connection) {
        EventEmitter.call(self);
        StateGraph.call(self);

        self.connection = connection;
        // self.socket = connection.socket;

        /**
         * Logic for a player in a game.
         *
         * @stategraph player Player
         */

        /**
         * Player can ready/unready while in the lobby state.
         *
         * @stategraph player
         * @state lobby Lobby
         * @next wait
         */
        self.state('lobby', function (lobby) {
            /**
             * Player can kick other players if they are the host.
             *
             * @stategraph player
             * @state lobby
             * @state host Host
             * @next player
             */
            lobby.state('host', function () {
                // kick playa'
            }).on('end', function () {
            });

            /**
             * Non-host players have no extra powers while in the lobby.
             *
             * @stategraph player
             * @state lobby
             * @state player Player
             * @next host
             */
            lobby.state('player', function () {
            });

            self.socket.on('ready', this.on_ready = function (state) {
                self.ready(Boolean(state));
            });
        }).on('end', function (lobby) {
            self.socket.removeEventListener('ready', this.on_ready);
        });

        /**
         * Player can't do anything while waiting.
         *
         * @stategraph player
         * @state wait Waiting 
         * @next turn
         */
        self.state('wait', function () {
        });

        /**
         * Player can set their registers during their turn.
         *
         * @stategraph player
         * @state turn Turn
         * @next waiting
         */
        self.state('turn', function () {
            // set registers
        });
    },
    turnState: function (self) {
    },
    lockRegisters: function (self) {
    },
    host: function (self, state) {
        if (typeof state !== 'undefined') {
            self._host = state;
        }
        return self._host;
    },
    ready: function (self, state) {
        if (typeof state !== 'undefined') {
            if (state) {
                self.emit('ready');
            }
            self._ready = state;
        }
        return self._ready;
    }
});

Player.mixin(StateGraph.prototype);

module.exports = Player;

//if (false) {
//    /*----- old code -----*/
//
//    function Player(client) {
//        var that = this;
//
//        EventEmitter.call(this);
//        StateGraph.call(this);
//
//        this.client = client;
//        this.ready = false;
//
//        client.socket.on('chat_message', function (message) {
//            that.game.players.forEach(function () {
//                this.client.socket.emit('chat_message', that.client, message);
//            });
//        });
//
//        client.socket.on('disconnect', function () {
//            that.state.end();
//            that.game.playerLeave(player);
//        });
//
//        this.state('lobby_host', function () {
//            that.client.socket.on('start_game', (this.start_game = function (callback) {
//                if (this.game.canStart()) {
//                    this.game.start();
//                } else {
//                    callback('Cannot start the game.');
//                }
//            }));
//            that.client.socket.on('kick_player', (this.kick_player = function (player) {
//                this.game.kickPlayer(player);
//            }));
//        }).on('end', function () {
//            that.client.socket.removeListener('start_game', this.start_game);
//            that.client.socket.removeListener('kick_player', this.kick_player);
//        });
//
//        this.state('lobby_player', function () {
//            that.client.socket.on('ready', (this.ready = function (value) {
//                this.ready = (value === true);
//            }));
//        }).on('end', function () {
//            that.client.socket.removeListener('ready', this.ready);
//        });
//
//        this.state('turn', function () {
//            that.client.socket.on('lock_cards', (this.lock_cards = function (cards) {
//            }));
//        }).on('end', function () {
//            that.client.socket.removeListener('lock_cards', this.lock_cards);
//        });
//
//        this.state('waiting', function () {
//            // do do do
//        }).on('end', function () {
//        });
//    }
//
//    Player.prototype = Object.create(EventEmitter.prototype);
//
//    _(Player.prototype).extend(StateGraph.prototype);
//
//    module.exports = Player;
//}
