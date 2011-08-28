var Lobby = require('./Lobby');

var COOL_NAME_BRO = ['Poop McButt', 'Percival Weiner', 'Cold Stone Cream Austin', 'Pwny Danza', 'Tits McGee', 'T.J. Hooker'];

function Client(socket) {
    var that = this;

    this.socket = socket;

    socket.on('host', function (name, callback) {
        that.name = name.trim().substr(0, 20);
        if (that.name === '') {
            callback('Invalid name');
            return;
        }
        
        var room = Lobby.createRoom(that);
        
        callback(false, room.toClient());
    });
    
    socket.on('join', function (key, callback) {
        var room = Lobby.rooms[key];
        if (!room) {
            return callback('Room does not exist.');
        }
        if (room.clients.length >= 6) {
            return callback('Room is full.');
        }
        /*if (!room.started) {
            return callback('That game has already started.');
        }*/
        for (var i = 0; i < COOL_NAME_BRO.length; i += 1) {
            that.name = COOL_NAME_BRO[i];
            if (!room.clients.some(function (client) {
                return that.name === client.name;
            })) {
                break;
            }
        }
        room.clientJoin(that);
        callback(false, room.toClient());
    });

    socket.on('start_game', function (callback) {
        if (!that.room) {
            callback('You are not in a lobby.');
        }
        callback(false, 'YOU WIN!');
    });

    socket.on('disconnect', function () {
        Client.clients = Client.clients.filter(function (v) {
            return v !== this;
        });
    });
}

Client.clients = [];

Client.join = function (socket) {
    Client.clients.push(new Client(socket));
};

module.exports = Client;
