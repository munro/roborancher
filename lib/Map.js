var Tile = require('./Tile'),
    Vector = require('./Vector');

/* rows is a list of lists of Tiles.  flagPositions is a list of flag positions.  botStarts
   is a list of lists like [ [ x, y ], direction ], one for each player for each number of 
   possible players. */
function Map(name, rows, flagPositions, botStarts) {
    this.name = name;
    this.rows = rows;
    this.flagPositions = flagPositions;
    this.botStarts = botStarts;

    this.size = { width: rows[0].length, height: rows.length };
};

/* see maps.js for example definitions. */
Map.fromDefinition = function(definition) {
    var rows = [];
    var flagPositions = [];
    for (var i = 0; i < definition.tiles.length; i++) {
        var codes = definition.tiles[i].split(/ +/);
        var row = [];
        for (var c = 0; c < codes.length; c++) {
            if (codes[c] === 'f') {
                flagPositions.push(new Vector(c, definition.tiles.length - i - 1));
                row.push(Tile.TILES.FLOOR);
            } else              
                row.push(Tile.fromCode(codes[c]));
        }
        rows.push(row);
    }
    return new Map(definition.name, rows, flagPositions, definition.bots);
};

Map.prototype.tileAt = function(x, y) {
    var tile = this.rows[this.size.height - y - 1][x];
    if (!tile)
        throw 'Map position is invalid: ' + x + ', ' + y
    return tile;
};

Map.prototype.getValidPlayerNumbers = function() {
    var playerNumbers = [];
    for (var i = 0; i < this.botStarts.length; i++)
        playerNumbers.push(this.botStarts[i].length);
    return playerNumbers.sort();
};

Map.prototype.positionIsOnMap = function(position) {
    if (position.x < 0 || position.x >= this.size.width
            || position.y < 0 || position.y >= this.size.height)
        return false;
    return true;
};

Map.prototype.getFlagAtPosition = function(position) {
    for (var i = 0; i < this.flagPositions.length; i++)
        if (position.equals(this.flagPositions[i]))
            return i;
    return undefined;
};

Map.prototype.getStartingPositionsFor = function(numPlayers) {
    for (var i = 0; i < this.botStarts.length; i++)
        if (this.botStarts[i].length === numPlayers) {
            var result = [];
            for (var c = 0; c < numPlayers; c++) {
                var start = {};
                start['position'] = new Vector(this.botStarts[i][c][0][0], 
                        this.botStarts[i][c][0][1]);
                start['direction'] = Vector.DIRECTIONS[this.botStarts[i][c][1]];
                result.push(start);
            }
            return result;
        }            

    throw numPlayers + ' is not a valid number of players for map ' + this.name + '.';
};

module.exports = Map;

if (require.main === module) {
    // tests
    // /*
    var map = new Map('test1', [ 
        [ 1, 2, 3 ], 
        [ 4, 5, 6 ] 
    ]);
    if (map.size.width != 3)
        dang;
    if (map.size.height != 2)
        dang;
    if (map.tileAt(0, 0) != 4)
        dang;
    if (map.tileAt(2, 0) != 6)
        dang;
    if (map.tileAt(0, 1) != 1)
        dang;
    if (map.tileAt(2, 1) != 3)
        dang;

    DEFINITION = {
        name: 'test2',
        bots: [ 
            [ [ [ 1, 0 ], 'UP' ] ],
            [ [ [ 0, 1 ], 'RIGHT' ], [ [ 2, 2 ], 'LEFT' ] ]
        ], 
        tiles: [
            'l  .  r',
            'f  fd .',
            '.  p  f',
            'u  .  d',
        ]
    }
    var map2 = Map.fromDefinition(DEFINITION);
    if (map2.size.width != 3)
        dang;
    if (map2.size.height != 4)
        dang;
    if (map2.tileAt(0, 0) !== Tile.TILES.CONVEYOR_UP)
        dang;
    if (map2.tileAt(0, 3) !== Tile.TILES.CONVEYOR_LEFT)
        dang;
    if (map2.tileAt(2, 3) !== Tile.TILES.CONVEYOR_RIGHT)
        dang;
    if (map2.tileAt(2, 0) !== Tile.TILES.CONVEYOR_DOWN)
        dang;
    if (map2.tileAt(1, 0) !== Tile.TILES.FLOOR)
        dang;
    if (map2.tileAt(1, 1) !== Tile.TILES.PIT)
        dang;
    if (map2.tileAt(1, 2) !== Tile.TILES.CONVEYOR_FAST_DOWN)
        dang;    
    if (map2.flagPositions.length != 2)
        dang;
    if (!map2.flagPositions[0].equals(new Vector(0, 2)))
        dang;
    if (!map2.flagPositions[1].equals(new Vector(2, 1)))
        dang;
    if (JSON.stringify(map2.getValidPlayerNumbers()) != '[1,2]')
        dang;
    if (JSON.stringify(map2.getStartingPositionsFor(1)) 
            != '[{"position":{"x":1,"y":0},"direction":{"x":0,"y":1}}]')
        dang;
    if (JSON.stringify(map2.getStartingPositionsFor(2))
            != '[{"position":{"x":0,"y":1},"direction":{"x":1,"y":0}}'
                + ',{"position":{"x":2,"y":2},"direction":{"x":-1,"y":0}}]')
        dang;
        
    if (map2.positionIsOnMap(new Vector(-1, 0)))
        dang;
    if (map2.positionIsOnMap(new Vector(0, -1)))
        dang;
    if (map2.positionIsOnMap(new Vector(3, 0)))
        dang;
    if (map2.positionIsOnMap(new Vector(0, 4)))
        dang;
    if (!map2.positionIsOnMap(new Vector(0, 0)))
        dang;
    if (!map2.positionIsOnMap(new Vector(2, 3)))
        dang;
    // */
}
