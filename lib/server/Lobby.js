var maps = require('./map_factory'),
    Card = require('./Card');

function Lobby(client, key) {
    var that = this;
    this.host = client;
    this.clients = [client];
    this.clients.emit = function () {
        for (var i = 0; i < that.clients.length; i += 1) {
            that.clients[i].socket.emit.apply(that.clients[i].socket, arguments);
        }
    };
    this.key = key;
    this.running = true;
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

Lobby.prototype.getRoomInfoFor = function (client) {
    var that = this;
    return {
        key: that.key,
        clients: this.clients.map(function (c) {
            return {
                owned: (c === client),
                host: (c === that.host),
                name: c.name,
                ready: c.ready
            };
        })
    };
};

Lobby.prototype.clientJoin = function (client) {
    client.room = this;
    this.clients.push(client);
    this.updateClients(client);
};

Lobby.prototype.clientKick = function (client) {
    client.room = this;
    this.clients.splice(this.clients.indexOf(client),1);
    this.updateClients(client);
};

Lobby.prototype.sendChatMessage = function(sender, msg) {
    this.clients.forEach(function (client) {
        client.socket.emit('chat_message_from_server', sender, msg);
    });
};

Lobby.prototype.updateClients = function () {
    var that = this;
    console.log('Updating clients');
    this.clients.forEach(function (client) {
        console.log('Updating client');
        client.socket.emit('update_lobby', that.getRoomInfoFor(client));
    });
};

Lobby.prototype.startGame = function () {
    var that = this;
    if (this.started) {
        return;
    }
    this.started = true;
    console.log('Starting game for clients...');
    this.clients.forEach(function (client) {
        console.log('Starting game...');
        client.socket.emit('start_game', {
            roomInfo: that.getRoomInfoFor(client),
            map: maps.frog_swamp
        });
    });
    this.startRound();
}

Lobby.prototype.startRound = function () {
    var that = this;
    this.clients.emit('start_round', 1); // START ROUND TIME
    setTimeout(function () {
        if (!that.running) {
            return;
        }
        that.clients.forEach(function (client) {
            client.hand = Card.getRandomCards(8);
            client.socket.emit('deal_cards', client.hand.map(function (card) {
                return card.toJSON();
            }));
        });
    }, 1000); // START ROUND TIME
    clearTimeout(this.register_timer);
    this.register_timer = false;
};

Lobby.prototype.startRegisterTimer = function () {
    if (this.register_timer) {
        return;
    }
    this.register_timer = setTimeout(function () {
        
    }, 1000); // ROUND TIMER
};

module.exports = Lobby;
