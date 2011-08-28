var Lobby = require('./Lobby');

var COOL_NAME_BRO = ['R2D2', 'Johnny 5', 'Wall-E', 'HAL'];


function Client(socket) {
    var that = this;

    this.socket = socket;

    socket.on('host', function (name, callback) {
        that.name = name.trim().substr(0, 20);
        if (that.name === '') {
            callback('Invalid name.');
            return;
        }
        
        var room = Lobby.createRoom(that);
        
        callback(false, room.getRoomInfoFor(that));
    });
    
    socket.on('join', function (key, name, callback) {
        var room = Lobby.rooms[key];
        that.name = name;
        if (!room) {
            return callback('Room does not exist.');
        }
        if (room.clients.length >= 4) {
            return callback('Room is full.');
        }
        if (room.started) {
            return callback('That game has already started.');
        }
        if (name === '') {
            for (var i = 0; i < COOL_NAME_BRO.length; i += 1) {
                that.name = COOL_NAME_BRO[i];
                if (!room.clients.some(function (client) {
                    return that.name === client.name;
                })) {
                    break;
                }
            }
        } else {
            while (room.clients.some(function (client) {
                return client.name === that.name;
            })) {
                that.name += '_';
            }
        }

        that.player = room.clients.length;
        room.clientJoin(that);
        callback(false, room.getRoomInfoFor(that));
    });
    
    socket.on('chat_message_from_client', function(msg) {
        if (that.room)
            that.room.sendChatMessage(that.name, msg);
    });

    socket.on('start_game', function (callback) {
        if (!that.room) {
            callback('You are not in a lobby.');
        } else {
            callback(false);
            that.hand = false;
            that.room.startGame();
        }
    });
    
    socket.on('registers_done', function (registers) {
        console.log('registers_done!!!!!!!!!', registers);
        if (that.room && that.hand) {
            that.registers = [];
            for (var i = 0; i < 5; i += 1) {
                if (typeof registers === 'object' && registers[i] === false) {
                    that.registers[i] = false;
                } else if (typeof registers === 'object' && registers[i] >= 0 &&
                        registers[i] < that.hand.length) {
                    that.registers[i] = that.hand[registers[i]];
                    that.hand[registers[i]] = false;
                }
            }
            that.hand = that.hand.filter(function (v) {
                return v !== false;
            });
            for (var i = 0; i < 5; i += 1) {
                if (that.registers[i] === false) {
                    // shuffle the hand
                    that.hand = that.hand.sort(function () {
                        return Math.random() > 0.5;
                    });
                    // Put random card into empty register
                    that.registers[i] = that.hand.pop();
                }
            }
            that.hand = false;
            console.log('REGISTERS SET', that.registers);
            that.room.startRegisterTimer(that);
        }
    });

    socket.on('disconnect', function () {
        console.log('Client disconnected.');
        Client.clients = Client.clients.filter(function (v) {
            return v !== this;
        });
    });
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
