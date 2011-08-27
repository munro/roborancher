var util = require('./util');

/*
 * Card
 */
function Card(interrupt, action, magnitude) {
  this.json = {
    'interrupt': interrupt,
    'action': action,
    'magnitude': magnitude
  };
};

exports.Card = Card;

/*
 * CardDeck
 */

function CardDeck() {
  var i, interrupt, magnitude, 
    copies = 4;

  this.queue = new util.PriorityQueue();

  /* add movement cards */
  for(i = 0; i < copies; ++i) {
    for(interrupt = 1; interrupt < 4; ++interrupt) {
      for(magnitude = 1; magnitude < 4; ++magnitude) {
          this.returnCard(new Card(interrupt, 'move', magnitude));
      }
    }
  }

  /* add turn cards */
  for(i = 0; i < copies; ++i) {
    for(interrupt = 1; interrupt < 4; ++interrupt) {
      this.returnCard(new Card(interrupt, 'turn', 1));
      this.returnCard(new Card(interrupt, 'turn', -1));
    }
  }
};

CardDeck.prototype.returnCard = function(card) {
  this.queue.push(Math.random(), card);
}

CardDeck.prototype.drawCard = function() {
  return this.queue.pop().value;
}

CardDeck.prototype.size = function() {
  return this.queue.size();
}

exports.CardDeck = CardDeck;

/*
 * Unit tests
 */
if(0 != 0) {
  var cards = new CardDeck();

  while(cards.size()) {
    console.log(cards.drawCard().json);
  }
}

