var util = require('./util'),
  
  game = new util.StateGraph();

/*
 * game logic entry point
 */
game.state('start', function() {
  console.log('I Zimbra!');
});

