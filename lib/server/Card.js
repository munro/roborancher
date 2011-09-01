var Deck = require('./Deck');

function Card(id) {
    this.id = id;
        
    for (var key in Card.CARD_TYPES)
        if (Card.CARD_TYPES.hasOwnProperty(key))
            if (Card.CARD_TYPES[key] === this.id) {
                this.name = key;
                break;
            }
    
    if (this.name === undefined)
        throw 'Invalid card id: ' + id;
};

Card.CARD_TYPES = {
    FORWARD: 1,
    FORWARD_2: 2,
    BACKWARD: 3,
    BACKWARD_2: 4,
    ROTATE_90_CW: 5,
    ROTATE_90_CCW: 6,
    ROTATE_180: 7
};

// just make 10 of each I guess
Card.buildDeck = function() {
    var cards = [];
    for (var key in Card.CARD_TYPES)
        if (Card.CARD_TYPES.hasOwnProperty(key))
            for (var c = 0; c < 10; c++)
                cards.push(new Card(Card.CARD_TYPES[key]));
    return new Deck(cards);
};

module.exports = Card;


// tests
// /*
// */