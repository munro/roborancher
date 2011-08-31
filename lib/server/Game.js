var StateGraph = require('./structures/StateGraph');

function Player(client) {
    this.client = client;
    this.state = new StateGraph();

    socket.on('chat_message_from_client', function (msg) {
        if (that.room) {
            that.room.sendChatMessage(that.name, msg);
        }
    });

    this.state.state('lobby', function () {
        socket.on('start_game', (this.start_game = function (callback) {
            if (!that.room) {
                callback('You are not in a lobby.');
            } else {
                callback(false);
                that.hand = false;
                that.room.startGame();
            }
        }));
    }).on('end', function () {
        socket.removeListener('start_game', this.start_game);
    });

    this.state.state('pre_turn', function () {
        this.timer = setTimeout(function () {
        }, 1000);
    }).on('end', function () {
        clearTimeout(this.timer);
    });

    var registers_done;
    this.state.state('turn', function () {
        socket.on('registers_done', (registers_done = function (registers) {
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
        }));
    });

    this.state.state('post_turn', function () {
    });

    this.state.state('execution', function () {

    });

    this.state.state('end', function () {
    });
}

function Game() {

}

Game.prototype.addClient = function (client) {
    this.
};

module.exports = Game;
