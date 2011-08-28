var maps = require('./map_factory'),
    Card = require('./Card'),
    Bot = require('./Bot');

var PLAYER_START_POSITIONS = { '1': [1, 1], '2': [2, 1], '3': [3, 1], '4': [4, 1] };

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
    
    initClientPlayer(client, 1);
}

Lobby.rooms = {};

function generateKey() {
    var key = '';
    for (var i = 0; i < 5; i += 1) {
        key += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return key;
}

function initClientPlayer(client, player) {
    client.player = player;
    client.bot = new Bot();
    client.bot.position = PLAYER_START_POSITIONS[client.player];
};

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
                ready: c.ready,
                player: c.player,
                position: c.bot.position,
                direction: c.bot.direction.name
            };
        })
    };
};

Lobby.prototype.clientJoin = function (client) {
    client.room = this;
    this.clients.push(client);
    initClientPlayer(client, this.clients.length);
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
    var that = this;
    if (this.register_timer) {
        return;
    }
    this.clients.emit('deal_timer', 10);  // ROUND TIMER
    this.register_timer = setTimeout(function () {
        if (!that.running) {
            return;
        }
        that.clients.forEach(function (client) {
            if (!client.registers) {
                client.registers = [];
                for (var i = 0; i < 5; i += 1) {
                    client.registers.push(client.hand.pop());
                }
                client.hand = false;
            }
            client.socket.emit('lock_registers', client.registers.map(function (card) {
                return card.toJSON();
            }));
        });
        that.executeBots();
    }, 10000); // ROUND TIMER
};

Lobby.prototype.executeBots = function () {
    // flip registers so we can pop off the front
    
    this.clients.forEach(function (client) {
        client.registers = client.registers.reverse();
        console.log('WTTTFF', client.registers);
    });
    var commands = [];
    for (var r = 0; r < 5; r += 1) {
        var stack = [];
        this.clients.forEach(function (client) {
            var card = client.registers.pop();
            if (card) {
                stack.push({client: client, card: card});
            }
        });
        stack.sort(function (a, b) {
            return a.card.interrupt > b.card.interrupt; // higher number player goes first?
        });
        
        while(stack.length) {
            var instr = stack.pop();
            console.log('CARD', instr.card);
            console.log('BOT POSITION BEFORE', instr.client.bot);
            instr.card.control(instr.client);
            console.log('BOT POSITION AFTER', instr.client.bot);
            commands.push({
                client: instr.client.player,
                position: instr.client.bot.position.slice(0),
                direction: instr.client.bot.direction.name
            });
        }
    }
    
    this.clients.emit('exec_stack', commands);
    // console.log('rawrrrr', commands);
};

module.exports = Lobby;
