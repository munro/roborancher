/*jslint node: true, newcap: true, nomen: true */

'use strict';

var EventEmitter = require('events').EventEmitter,
    Game = require('./Game'),
    Self = require('self'),
    StateGraph = require('./structures/StateGraph');

var Connection = Self(EventEmitter, {
    initialize: function (self, socket) {
        // Initial parent constructors
        EventEmitter.call(self);
        StateGraph.call(self);

        self._socket = socket;

        self.state('idle', function (idle) {
            self.socket.on(
                'set_name',
                this.set_name = function (name, callback) {
                    if (typeof name !== 'string') {
                        name = '';
                    } else {
                        name = name.trim().substr(0, 20);
                    }
                    self.name = name;
                    callback(self.name === '' && 'Please enter a name.');
                }
            );

            socket.on('host', idle.host = function (name, callback) {
                if (self.name === '') {
                    return callback('Please enter a name.');
                }
                self.game = Game.createGame(self);
                self.state.go('game');
                callback(false);
            });

            socket.on('join', this.join = function (key, callback) {
                var game;

                if (self.name === '') {
                    return callback('Please enter a name.');
                }

                game = Game.findGame(key);

                if (!game) {
                    return callback('Game not found');
                }

                if (!game.inProgress()) {
                    return callback('Cannot join, game is already in progress');
                }

                self.game = game.playerJoin(self, key);
                self.state.go('game');
                callback(false);
            });
        }).on('end', function (idle) {
            socket.removeListener('set_name', idle.set_name);
            socket.removeListener('host', idle.host);
            socket.removeListener('join', idle.join);
        });


        self.state('game', function (game) {
            // TODO on leave game, switch back to idle state
        }).on('end', function (game) {
        });

        self.socket.on('disconnect', function () {
            // TODO remove client
        });

        self.go('idle');
    },
    end: function (self) {
        self.state.end();
        // @TODO cleanup client
    }
});

Connection.mixin(StateGraph.prototype);

module.exports = Connection;
