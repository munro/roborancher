var dir = require('./direction');

/* a bot isa collection of bot parts
 * a bot part hasa name and a list of information such that
 *   description := string descrition of the bot part
 *   thingProp := seralized string represneting this part's properties
 *   thingCost := weight, energy, "points" and other costs seralized
 *   thingSprite := link to sprite file
 *   thingSound := link to sound file (optional)
 */
 
// north = dir.north;
// east = dir.east;
// south = dir.south;
// west = dir. west;
 
lstDirs = [north,east,west,south];
 
function Bot(){
    this.position = [0,0];
    this.direction = north;
}

Bot.prototype.forwards = function(){
    this.position = this.direction.move(this.position);
};

Bot.prototype.backwards = function(){
    this.position = this.direction.reverse(this.position);
};

Bot.prototype.rotate_cw = function(){
    this.direction = this.direction.turn('cw');
};

Bot.prototype.rotate_ccw = function(){
    this.direction = this.direction.turn('ccw');
};

Bot.prototype.uturn = function(){
    this.direction = this.direction.turn('around');
};

module.exports = Bot;
