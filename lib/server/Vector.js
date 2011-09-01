function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.equals = function(vector) {
    return (this.x === vector.x && this.y === vector.y);
};

Vector.prototype.add = function(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
};

Vector.prototype.subtract = function(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
};

Vector.prototype.rotate90CW = function() {
    return new Vector(this.y, -this.x);
};

Vector.prototype.rotate90CCW = function() {
    return new Vector(-this.y, this.x);
};

Vector.prototype.rotate180 = function() {
    return new Vector(-this.x, -this.y);
};

Vector.prototype.getDirectionName = function() {
    for (var key in Vector.DIRECTIONS)
        if (Vector.DIRECTIONS.hasOwnProperty(key))
            if (this.equals(Vector.DIRECTIONS[key]))
                return key;
};

Vector.DIRECTIONS = {
    UP: new Vector(0, 1),
    DOWN: new Vector(0, -1),
    LEFT: new Vector(-1, 0),
    RIGHT: new Vector(1, 0)
};

module.exports = Vector;


// tests
// /*
var v = new Vector(0, 0);
var v2 = v.add(Vector.DIRECTIONS.UP);
if (v2.x !== 0 || v2.y !== 1)
    dang;
var v3 = v.subtract(Vector.DIRECTIONS.LEFT);
if (v3.x !== 1 || v3.y !== 0)
    dang;

if (!Vector.DIRECTIONS.UP.rotate90CW().equals(Vector.DIRECTIONS.RIGHT))
    dang;
if (!Vector.DIRECTIONS.LEFT.rotate90CW().equals(Vector.DIRECTIONS.UP))
    dang;
if (!Vector.DIRECTIONS.DOWN.rotate90CCW().equals(Vector.DIRECTIONS.RIGHT))
    dang;
if (!Vector.DIRECTIONS.RIGHT.rotate90CCW().equals(Vector.DIRECTIONS.UP))
    dang;

if (!Vector.DIRECTIONS.LEFT.rotate180().equals(Vector.DIRECTIONS.RIGHT))
    dang;
if (!Vector.DIRECTIONS.UP.rotate180().equals(Vector.DIRECTIONS.DOWN))
    dang;

if (Vector.DIRECTIONS.UP.getDirectionName() !== 'UP')
    dang;
if (Vector.DIRECTIONS.LEFT.getDirectionName() !== 'LEFT')
    dang;
if (new Vector(0, 1).getDirectionName() !== 'UP')
    dang;
if (new Vector(1, 1).getDirectionName())
    dang;

// */

