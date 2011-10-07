var StateGraph = require('./structures/StateGraph'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

function Player(client) {
    var that = this;

    EventEmitter.call(this);
    StateGraph.call(this);

    this.client = client;
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

    this.state('lobby_host', function () {
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

    this.state('lobby_player', function () {
        that.client.socket.on('ready', (this.ready = function (value) {
            this.ready = (value === true);
        }));
    }).on('end', function () {
        that.client.socket.removeListener('ready', this.ready);
    });

    this.state('turn', function () {
        that.client.socket.on('lock_cards', (this.lock_cards = function (cards) {
        }));
    }).on('end', function () {
        that.client.socket.removeListener('lock_cards', this.lock_cards);
    });

    this.state('waiting', function () {
        // do do do
    }).on('end', function () {
    });
}

Player.prototype = Object.create(EventEmitter.prototype);

_(Player.prototype).extend(StateGraph.prototype);

module.exports = Player;
