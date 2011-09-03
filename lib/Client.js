var Game = require('./Game'),
    StateGraph = require('./structures/StateGraph');

function Client(socket) {
    var that = this;

    this.socket = socket;
    this.state = new StateGraph();

    this.state.state('idle', function () {
        socket.on('set_name', (this.set_name = function (callback) {
            that.name = name.trim().substr(0, 20);
            callback(this.name === '' && 'Please enter a name.');
        }));

        socket.on('host', (this.host = function (callback) {
            if (this.name === '') {
                return callback('Please enter a name.');
            }
            try {
                that.game = Game.createGame(client);
                that.state.go('game');
                callback(false);
            } catch (e) {
                callback(e);
            }
        }));

        socket.on('join', (this.join = function (key, callback) {
            if (this.name === '') {
                return callback('Please enter a name.');
            }
            try {
                that.game = Game.joinGame(that, key);
                that.state.go('game');
                callback(false);
            } catch (e) {
                callback(e);
            }
        }));
    }).on('end', function () {
        socket.removeListener('set_name', this.set_name);
        socket.removeListener('host', this.host);
        socket.removeListener('join', this.join);
    });

    this.state.state('game', function () {
        callback(false, that.game.getRoomInfoFor(that));
    }).on('end', function () {
        that.game.leave(that);
    });

    socket.on('disconnect', function () {
        console.log('Client disconnected.');
        Client.clients = Client.clients.filter(function (v) {
            return v !== this;
        });
        that.state.end();
    });

    this.state.go('idle');
}

Client.clients = [];

Client.join = function (socket) {
    Client.clients.push(new Client(socket));
};

Client.prototype.getEnemyBots = function (socket) {
    var bots = [];
    for (var i = 0; i < this.room.clients.length; i++) {
        var c = this.room.clients[i];
        if (c == this || c == 0)
            continue;
        bots.push(c.bot);
    };
    return bots;
};

module.exports = Client;
