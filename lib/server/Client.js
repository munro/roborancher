var Lobby = require('./Lobby');

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
