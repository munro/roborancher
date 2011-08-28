var maps = require('./map_factory'),
    Card = require('./Card'),
    Bot = require('./Bot');

var PLAYER_START_POSITIONS = { '1': [1, 1], '2': [2, 1], '3': [3, 1], '4': [4, 1] };


var START_ROUND_TIME = 1;
var START_TIME_LEFT = 10;

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
    this.clients.emit('start_round', START_ROUND_TIME); // START ROUND TIME
    setTimeout(function () {
        if (!that.running) {
            return;
        }
        that.clients.forEach(function (client) {
            client.register_locked = false;
            client.hand = Card.getRandomCards(8);
            client.socket.emit('deal_cards', client.hand.map(function (card) {
                return card.toJSON();
            }));
        });
    }, START_ROUND_TIME * 1000); // START ROUND TIME
    clearTimeout(this.register_timer);
    this.register_timer = false;
};

Lobby.prototype.startRegisterTimer = function (client) {
    client.register_locked = true;
    var that = this;
    
    function next() {
        if (!that.running) {
            return;
        }
        that.clients.forEach(function (client) {
            if (!client.registers) {
                // shuffle their hand
                console.log('HAND PRE', client.hand);
                client.hand = client.hand.filter(function (v) {
                    return v !== false;
                }).sort(function () {
                    return Math.random() > 0.5;
                });
                console.log('HAND POST', client.hand);
                client.registers = [];
                for (var i = 0; i < 5; i += 1) {
                    client.registers.push(client.hand.pop());
                }
                client.hand = false;
                console.log('REGISTERS', client.registers);
            }
            
            client.socket.emit('lock_registers', client.registers.map(function (card) {
                return card.toJSON();
            }));
        });
        that.executeBots();
    }
    
    
    if (this.register_timer) {
        if (this.clients.every(function (client) {
            return client.register_locked === true;
        })) {
            clearTimeout(this.register_timer);
            this.register_timer = false;
            next();
        }
        return;
    }
    this.clients.emit('deal_timer', START_TIME_LEFT);  // ROUND TIMER
    this.register_timer = setTimeout(function () {
        next();
    }, START_TIME_LEFT * 1000 + 3000); // ROUND TIMER
};

Lobby.prototype.executeBots = function () {
    var that = this;
    // flip registers so we can pop off the front
    this.clients.forEach(function (client) {
        client.registers = client.registers.reverse();
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
        
        this.clients.forEach(function (client) {
            maps.execTileMotion(client.bot);
            commands.push({
                client: client.player,
                position: client.bot.position.slice(0),
                direction: client.bot.direction.name
            });
        });
    }
    
    this.clients.forEach(function (client) {
        client.registers = false;
        client.hand = false;
    });
    
    this.clients.emit('exec_stack', commands);
    setTimeout(function () {
        console.log('Start ROUND');
        that.startRound();
    }, commands.length * 500);
    console.log('WAIT', commands.length * 500);
    // console.log('rawrrrr', commands);
};

module.exports = Lobby;
