function Tile(name, id, code, actionCode) {
    this.name = name;
    this.id = id;
    this.code = code;
    this.actionCode = actionCode;
}

Tile.fromCode = function(code) {
    for (var key in Tile.TILES)
        if (Tile.TILES.hasOwnProperty(key))
            if (Tile.TILES[key].code === code)
                return Tile.TILES[key];
};

Tile.TILES = {};

var tiledefs = {
    CONVEYOR_DOWN: { code: 'd', id: 1, actionCode: 'd1' },
    CONVEYOR_FAST_DOWN: { code: 'fd', id: 2, actionCode: 'd2' },
    CONVEYOR_FAST_LEFT: { code: 'fl', id: 3, actionCode: 'l2' },
    CONVEYOR_FAST_RIGHT: { code: 'fr', id: 4, actionCode: 'r2' },
    CONVEYOR_FAST_RIGHT_DOWN: { code: 'frd', id: 5, actionCode: 'd2' },
    CONVEYOR_FAST_DOWN_LEFT: { code: 'fdl', id: 6, actionCode: 'l2' },
    CONVEYOR_FAST_UP_RIGHT: { code: 'fur', id: 7, actionCode: 'r2' },
    CONVEYOR_FAST_LEFT_UP: { code: 'flu', id: 8, actionCode: 'u2' },
    CONVEYOR_FAST_UP: { code: 'fu', id: 9, actionCode: 'u2' },
    CONVEYOR_LEFT: { code: 'l', id: 10, actionCode: 'l1' },
    CONVEYOR_RIGHT: { code: 'r', id: 11, actionCode: 'r1' },
    CONVEYOR_TURN_RIGHT_DOWN: { code: 'rd', id: 12, actionCode: 'd1' },
    CONVEYOR_TURN_DOWN_LEFT: { code: 'dl', id: 13, actionCode: 'l1' },
    CONVEYOR_TURN_UP_RIGHT: { code: 'ur', id: 14, actionCode: 'r1' },
    CONVEYOR_TURN_LEFT_UP: { code: 'lu', id: 15, actionCode: 'u1' },
    CONVEYOR_UP: { code: 'u', id: 16, actionCode: 'u1' },
    FLAG: { code: 'f', id: 17, actionCode: undefined },
    FLOOR: { code: '.', id: 18, actionCode: undefined },
    PIT: { code: 'p', id: 19, actionCode: undefined },
    REPAIR: { code: '+', id: 20, actionCode: undefined },
    ROTATE_ONCE_CCW: { code: 'o-', id: 21, actionCode: 'w1' },
    ROTATE_ONCE_CW: { code: 'o', id: 22, actionCode: 'c1' },
    ROTATE_TWICE_CCW: { code: 'ot-', id: 23, actionCode: 'w2' },
    ROTATE_TWICE_CW: { code: 'ot', id: 24, actionCode: 'c2' },
    WALL_BOTTOM: { code: 'wb', id: 25, actionCode: undefined },
    WALL_LEFT: { code: 'wl', id: 26, actionCode: undefined },
    WALL_RIGHT: { code: 'wr', id: 27, actionCode: undefined },
    WALL_TOP: { code: 'wt', id: 28, actionCode: undefined },
    CONVEYOR_FAST_RIGHT_UP: { code: 'fru', id: 29, actionCode: 'u2' },
    CONVEYOR_FAST_DOWN_RIGHT: { code: 'fdr', id: 30, actionCode: 'r2' },
    CONVEYOR_FAST_UP_LEFT: { code: 'ful', id: 31, actionCode: 'l2' },
    CONVEYOR_FAST_LEFT_DOWN: { code: 'fld', id: 32, actionCode: 'd2' },
    CONVEYOR_RIGHT_UP: { code: 'ru', id: 33, actionCode: 'u1' },
    CONVEYOR_DOWN_RIGHT: { code: 'dr', id: 34, actionCode: 'r1' },
    CONVEYOR_UP_LEFT: { code: 'ul', id: 35, actionCode: 'l1' },
    CONVEYOR_LEFT_DOWN: { code: 'ld', id: 36, actionCode: 'd1' },
};

// build the tiles as Tile instances
for (var key in tiledefs) {
    if (tiledefs.hasOwnProperty(key)) {
        var td = tiledefs[key];
        Tile.TILES[key] = new Tile(key, td.id, td.code, td.actionCode);
    }
}

module.exports = Tile;

if (require.main === module) {
    // tests
    // /*
    if (!Tile.fromCode('.'))
        dang;
    if (Tile.fromCode('.') !== Tile.TILES.FLOOR)
        dang;
    if (Tile.fromCode('ld') !== Tile.TILES.CONVEYOR_LEFT_DOWN)
        dang;
    // */
}
