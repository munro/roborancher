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

Lobby.prototype.updateClients = function (except) {
    var that = this;
    this.clients.forEach(function (client) {
        if (except && client !== except) {
            client.socket.emit('update_lobby', that.toClient());
        }
    });
};

module.exports = Lobby;
