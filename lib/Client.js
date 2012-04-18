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
            socket.on('set_name', this.set_name = function (callback) {
                self.name = name.trim().substr(0, 20);
                callback(this.name === '' && 'Please enter a name.');
            });

            socket.on('host', (this.host = function (name, callback) {
                if (this.name === '') {
                    return callback('Please enter a name.');
                }
                self.game = Game.createGame(self);
                self.state.go('game');
                callback(false);
                callback(e);
            }));

            socket.on('join', (this.join = function (key, callback) {
                if (this.name === '') {
                    return callback('Please enter a name.');
                }
                try {
                    var game = Game.findGame(key);
                    self.game = game.playerJoin(self, key);
                    self.state.go('game');
                    callback(false);
                } catch (e) {
                    callback((typeof e === 'object' ? e.message : e) || 'You suck');
                }
            }));
        }).on('end', function (idle) {
            socket.removeListener('set_name', idle.set_name);
            socket.removeListener('host', idle.host);
            socket.removeListener('join', idle.join);
        });
    }
});

Connection.mixin(StateGraph.prototype);

module.exports = Connection;

//function Client(socket) {
//    var that = this;
//
//    this.socket = socket;
//    this.state = new StateGraph();
//
//    this.state.state('idle', function () {
//        socket.on('set_name', (this.set_name = function (callback) {
//            that.name = name.trim().substr(0, 20);
//            callback(this.name === '' && 'Please enter a name.');
//        }));
//
//        socket.on('host', (this.host = function (name, callback) {
//            if (this.name === '') {
//                return callback('Please enter a name.');
//            }
//            that.game = Game.createGame(that);
//            that.state.go('game');
//            callback(false);
//            callback(e);
//        }));
//
//        socket.on('join', (this.join = function (key, callback) {
//            if (this.name === '') {
//                return callback('Please enter a name.');
//            }
//            try {
//                var game = Game.findGame(key);
//                that.game = game.playerJoin(that, key);
//                that.state.go('game');
//                callback(false);
//            } catch (e) {
//                callback((typeof e === 'object' ? e.message : e) || 'You suck');
//            }
//        }));
//    }).on('end', function () {
//        socket.removeListener('set_name', this.set_name);
//        socket.removeListener('host', this.host);
//        socket.removeListener('join', this.join);
//    });
//
//    this.state.state('game', function () {
//        callback(false, that.game.getRoomInfoFor(that));
//    }).on('end', function () {
//        that.game.leave(that);
//    });
//
//    socket.on('disconnect', function () {
//        console.log('Client disconnected.');
//        Client.clients = Client.clients.filter(function (v) {
//            return v !== this;
//        });
//        that.state.end();
//    });
//
//    this.state.go('idle');
//}
//
//Client.clients = [];
//
//Client.join = function (socket) {
//    Client.clients.push(new Client(socket));
//};
