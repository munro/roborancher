var maps = require('./map_factory');

function Lobby(client, key) {
    this.host = client;
    this.clients = [client];
    this.key = key;
    client.room = this;
}

Lobby.rooms = {};

function generateKey() {
    var key = '';
    for (var i = 0; i < 5; i += 1) {
        key += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return key;
}

Lobby.createRoom = function (client) {
    var key;
    // find new room
    while (key = generateKey()) {
        if(!Lobby.rooms[key]) {
            break;
        }
    }
    // create room!
    Lobby.rooms[key] = new Lobby(client, key);
    return Lobby.rooms[key];
};

Lobby.prototype.toClient = function () {
    var that = this;
    return {
        key: that.key,
        clients: this.clients.map(function (client) {
            return {
                host: (client === that.host),
                name: client.name,
                ready: client.ready
            };
        })
    };
};

Lobby.prototype.clientJoin = function (client) {
    client.room = this;
    this.clients.push(client);
    this.updateClients(client);
};

Lobby.prototype.sendChatMessage = function(sender, msg) {
    this.clients.forEach(function (client) {
        client.socket.emit('chat_message_from_server', sender, msg);
    });
};

Lobby.prototype.updateClients = function (except) {
    var that = this;
    console.log('Updating clients');
    this.clients.forEach(function (client) {
        if (except && client !== except) {
            console.log('Updating client');
            client.socket.emit('update_lobby', that.toClient());
        }
    });
};

Lobby.prototype.startGame = function () {
    console.log('Starting game for clients...');
    this.clients.forEach(function (client) {
        console.log('Starting game...');
        client.socket.emit('start_game', maps.frog_swamp);
    });
}

module.exports = Lobby;
