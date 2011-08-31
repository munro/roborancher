var Vector = require('./Vector');

// position and direction are Vectors.
function Bot(position, direction) {
    this.position = position;
    this.direction = direction;
}

Bot.prototype.move = function(direction) {
    this.position = this.peekMove(direction);
}

Bot.prototype.peekMove = function(direction) {
    return this.position.add(direction);
}

Bot.prototype.rotate90CW = function() {
    this.direction = this.direction.rotate90CW();
}

Bot.prototype.rotate90CCW = function() {
    this.direction = this.direction.rotate90CCW();
}

Bot.prototype.rotate180 = function() {
    this.direction = this.direction.rotate180();
}

module.exports = Bot;


// tests
// /*
var b = new Bot(new Vector(0, 0), Vector.DIRECTIONS.UP);
var p = b.peekMove(Vector.DIRECTIONS.LEFT);
if (p.x != -1 || p.y != 0)
    dang;
var p = b.peekMove(Vector.DIRECTIONS.RIGHT);
if (p.x != 1 || p.y != 0)
    dang;
var p = b.peekMove(Vector.DIRECTIONS.UP);
if (p.x != 0 || p.y != 1)
    dang;
var p = b.peekMove(Vector.DIRECTIONS.DOWN);
if (p.x != 0 || p.y != -1)
    dang;

b.move(Vector.DIRECTIONS.DOWN);
if (b.position.x != 0 || b.position.y != -1)
    dang;
    
b.rotate90CW();
if (!b.direction.equals(Vector.DIRECTIONS.RIGHT))
    dang;
// */