function Card(action, magnitude, control) {
    Card.cards[action] = this;
    this.action = action;
    this.magnitude = magnitude;
    this.control = control;
};

Card.prototype.toJSON = function () {
    return {action: this.action, magnitude: this.magnitude};
};

Card.cards = [];
Card.cards.push(new Card('forwards', 1, function (bot) {
    bot.forwards();
}));
/*Card.cards.push(new Card('forwards', 2, function (bot) {
    bot.forwards();
}));
Card.cards.push(new Card('forwards', 3, function (bot) {
    bot.forwards();
}));*/
Card.cards.push(new Card('backwards', 1, function (bot) {
    bot.backwards();
}));
/*Card.cards.push(new Card('backwards', 2, function (bot) {
    bot.forwards();
}));
Card.cards.push(new Card('backwards', 3, function (bot) {
    bot.forwards();
}));*/
Card.cards.push(new Card('turn_left', 1, function (bot) {
    bot.rotate_ccw();
}));
Card.cards.push(new Card('turn_right', 1, function (bot) {
    bot.rotate_cw();
}));

Card.getRandomCards = function (amount) {
    var cards = [];
    for(var i = 0; i < amount; i += 1) {
        cards.push(Card.cards[Math.floor(Math.random() * Card.cards.length)]);
    }
    return cards;
};

for(var i = 0; i < Card.cards.length; i += 1) {
    Card.cards[i].interrupt = i;
}

module.exports = Card;
