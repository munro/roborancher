var util = require('./util');

function Deck() {
    this.queue = new util.PriorityQueue();
};

Deck.prototype.addCard = function(card) {
    this.queue.push(Math.random(), card);
}

Deck.prototype.drawCard = function() { 
    return this.queue.pop();
}

/*
 * unit tests
 */
if(1 == 1) {
    var deck = new Deck();

    deck.addCard('card1');
    deck.addCard('card2');

    console.log(deck.drawCard());
    console.log(deck.drawCard());
    console.log(deck.drawCard());
}
