var util = require('./util');

/*
 * Bot
 */
function Bot() {}

exports.Bot = Bot;

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
};

CardDeck.prototype.drawCard = function() {
  return this.queue.pop().value;
};

CardDeck.prototype.size = function() {
  return this.queue.size();
};

exports.CardDeck = CardDeck;


/* 
 * GameBoard
 */
function GameBoard(width, height) {
  var i;

  this.tiles = new Array(height);
  for(i = 0; i < height; ++i) {
    this.tiles[i] = new Array(width);
  }
};

GameBoard.prototype.setTile = function(x, y, tile) {
  this.tiles[x][y] = tile;
};

GameBoard.prototype.getTile = function(x, y) {
  return this.tiles[x][y];
};

exports.GameBoard = GameBoard;


/*
 * GameState
 */
function GameState(players) {
  this.deck = new CardDeck();
  this.board = new GameBoard();
  this.players = players;
};

GameState.prototype = Object.create(util.EventObject.prototype);

GameState.prototype.dealCard = function(player) {
  var card;
  
  console.log(player.cards.length);

  /* is the player allowed more cards? */
  if(player.maxCards <= player.cards.length)
    return false;

  card = this.deck.drawCard();
  player.cards.push(card);
  //this.emit('dealCard', player, card);

  return true;
};


GameState.prototype.moveBot = function(bot, to, from) {
  /* logic here */
  this.emit('moveBot', bot, to, from);
};

GameState.registerProgram = function(bot, program) {
  /* bleh */
};

exports.GameState = GameState;

/*
 * Player
 */
function Player(bot) {
  this.maxCards = 7;
  this.cards = [];
  this.bot = new Bot();
}

exports.Player = Player;

/*
 * Tile
 */
function Tile() {
  this.objects = [];
};

Tile.prototype.placeObject = function(obj) {
  objects.push(obj);
  return true;
};

Tile.prototype.numObjects = function() {
  return this.objects.size();
};

exports.Tile = Tile;

/*
 * Wall
 */
function Wall() {}

Wall.prototype = Object.create(Tile.prototype);

Wall.prototype.placeObject = function() {
  return false;
};

exports.Wall = Wall;

/*
 * Unit tests
 */
if(1 == 0) {
  var state = new GameState(),
    cards = state.deck;

  while(cards.size()) {
    console.log(cards.drawCard().json);
  }

}

