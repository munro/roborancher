var util = require('./util'),
  game = require('./game'),
  rules = new util.StateGraph();

console.log(rules);

/*
 * Deal: give all players cards
 */
rules.state('deal', function(state) {
  var i, j, player, deal;

  deal = true;
  while(deal) {
    deal = false;

    for(i = 0; i < state.players.length; ++i) {
      deal = state.dealCard(state.players[i]); /* network call */
    }
  }

  /* show hands */
  for(i = 0; i < state.players.length; ++i) {
    player = state.players[i];

    console.log("===Player %i===", i);
    for(j = 0; j < player.cards.length; ++j) {
      console.log(player.cards[j]);
    }
  }

  return this.go('register');
});

/*
 * Register: wait for players to input cards.
 */
rules.state('register', function(state) {
   /* wait for players to register their cards */
});

rules.state('start', function(numPlayers) {
  var i, players = [];

  for(i = 0; i < numPlayers; ++i) {
    players.push(new game.Player());
  }

  return this.go('deal', new game.GameState(players));
});

rules.go('start', 2);


