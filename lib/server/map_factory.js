var dir = require('./direction');

// todo: move to a common area, it's duplicated on the client in main.js
var TILES = {
    CONVEYOR_DOWN: { code: 'd', index: 1, image: 'conveyor-down.png' },
    CONVEYOR_FAST_DOWN: { code: 'fd', index: 2, image: 'conveyor-fast-down.png' },
    CONVEYOR_FAST_LEFT: { code: 'fl', index: 3, image: 'conveyor-fast-left.png' },
    CONVEYOR_FAST_RIGHT: { code: 'fr', index: 4, image: 'conveyor-fast-right.png' },
    CONVEYOR_FAST_RIGHT_DOWN: { code: 'frd', index: 5, image: 'conveyor-fast-right-down.png' },
    CONVEYOR_FAST_DOWN_LEFT: { code: 'fdl', index: 6, image: 'conveyor-fast-down-left.png' },
    CONVEYOR_FAST_UP_RIGHT: { code: 'fur', index: 7, image: 'conveyor-fast-up-right.png' },
    CONVEYOR_FAST_LEFT_UP: { code: 'flu', index: 8, image: 'conveyor-fast-left-up.png' },
    CONVEYOR_FAST_UP: { code: 'fu', index: 9, image: 'conveyor-fast-up.png' },
    CONVEYOR_LEFT: { code: 'l', index: 10, image: 'conveyor-left.png' },
    CONVEYOR_RIGHT: { code: 'r', index: 11, image: 'conveyor-right.png' },
    CONVEYOR_TURN_RIGHT_DOWN: { code: 'rd', index: 12, image: 'conveyor-right-down.png' },
    CONVEYOR_TURN_DOWN_LEFT: { code: 'dl', index: 13, image: 'conveyor-down-left.png' },
    CONVEYOR_TURN_UP_RIGHT: { code: 'ur', index: 14, image: 'conveyor-up-right.png' },
    CONVEYOR_TURN_LEFT_UP: { code: 'lu', index: 15, image: 'conveyor-left-up.png' },
    CONVEYOR_UP: { code: 'u', index: 16, image: 'conveyor-up.png' },
    FLAG: { code: 'f', index: 17, image: 'flag.png' },
    FLOOR: { code: '.', index: 18, image: 'floor.png' },
    PIT: { code: 'p', index: 19, image: 'pit.png' },
    REPAIR: { code: '+', index: 20, image: 'repair.png' },
    ROTATE_ONCE_CCW: { code: 'o-', index: 21, image: 'rotate-once-ccw.png' },
    ROTATE_ONCE_CW: { code: 'o', index: 22, image: 'rotate-once-cw.png' },
    ROTATE_TWICE_CCW: { code: 'ot-', index: 23, image: 'rotate-twice-ccw.png' },
    ROTATE_TWICE_CW: { code: 'ot', index: 24, image: 'rotate-twice-cw.png' },
    WALL_BOTTOM: { code: 'wb', index: 25, image: 'wall-bottom.png' },
    WALL_LEFT: { code: 'wl', index: 26, image: 'wall-left.png' },
    WALL_RIGHT: { code: 'wr', index: 27, image: 'wall-right.png' },
    WALL_TOP: { code: 'wt', index: 28, image: 'wall-top.png' },
    CONVEYOR_FAST_RIGHT_UP: { code: 'fru', index: 29, image: 'conveyor-fast-right-up.png' },
    CONVEYOR_FAST_DOWN_RIGHT: { code: 'fdr', index: 30, image: 'conveyor-fast-down-right.png' },
    CONVEYOR_FAST_UP_LEFT: { code: 'ful', index: 31, image: 'conveyor-fast-up-left.png' },
    CONVEYOR_FAST_LEFT_DOWN: { code: 'fld', index: 32, image: 'conveyor-fast-left-down.png' },
    CONVEYOR_RIGHT_UP: { code: 'ru', index: 33, image: 'conveyor-right-up.png' },
    CONVEYOR_DOWN_RIGHT: { code: 'dr', index: 34, image: 'conveyor-down-right.png' },
    CONVEYOR_UP_LEFT: { code: 'ul', index: 35, image: 'conveyor-up-left.png' },
    CONVEYOR_LEFT_DOWN: { code: 'ld', index: 36, image: 'conveyor-left-down.png' },
};

exports.frog_swamp = [
    '.   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   ',
    '.   .   .   .  ur   r   r   r   r   r   r   r   r   r   r  rd   .   .   .   .   ',
    '.   .   .   .   u   .   .   .   .   .   .   .   .   .   .   d  wr   o-  .   .   ',
    '.   .   o   .   u   .   . fld  fl  fl  fl  fl ful   .   .   d  wr   .   .   .   ',
    '.  wb  wb   .   u   .   .  fd   .   f   .   .  fu   .   .   d  wr   ot  .   .   ',
    '.   .  ot- wl   u   .   .  fd   .   .   .   .  fu   .   .   d   .   wt wt   .   ',
    '.   .   .  wl   u   .   . fdr  fr  fr  fr  fr fru   .   .   d   .   o-  .   .   ',
    '.   .   o  wl   u   .   .   .   .   .   .   .   .   .   .   d   .   .   .   .   ',
    '.   .   .   .  lu   l   l   l   l   l   l   l   l   l   l  dl   .   .   .   .   ',
    '.   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   ',
];

// first item is the collision on the current tile, second is the collision on the tile
// we would be entering
var DIRECTION_COLLISION_MAP = {
    'north': [ TILES.WALL_TOP, TILES.WALL_BOTTOM ],
    'south': [ TILES.WALL_BOTTOM, TILES.WALL_TOP ],
    'east': [ TILES.WALL_RIGHT, TILES.WALL_LEFT ],
    'west': [ TILES.WALL_LEFT, TILES.WALL_RIGHT ]
};

var ACTION_MAP = {};
ACTION_MAP[TILES.CONVEYOR_DOWN.index] = 'd1';
ACTION_MAP[TILES.CONVEYOR_FAST_DOWN.index] = 'd2';
ACTION_MAP[TILES.CONVEYOR_FAST_LEFT.index] = 'l2';
ACTION_MAP[TILES.CONVEYOR_FAST_RIGHT.index] = 'r2';
ACTION_MAP[TILES.CONVEYOR_FAST_RIGHT_DOWN.index] = 'd2';
ACTION_MAP[TILES.CONVEYOR_FAST_DOWN_LEFT.index] = 'l2';
ACTION_MAP[TILES.CONVEYOR_FAST_UP_RIGHT.index] = 'r2';
ACTION_MAP[TILES.CONVEYOR_FAST_LEFT_UP.index] = 'u2';
ACTION_MAP[TILES.CONVEYOR_FAST_UP.index] = 'u2';
ACTION_MAP[TILES.CONVEYOR_LEFT.index] = 'l1';
ACTION_MAP[TILES.CONVEYOR_RIGHT.index] = 'r1';
ACTION_MAP[TILES.CONVEYOR_TURN_RIGHT_DOWN.index] = 'd1';
ACTION_MAP[TILES.CONVEYOR_TURN_DOWN_LEFT.index] = 'l1';
ACTION_MAP[TILES.CONVEYOR_TURN_UP_RIGHT.index] = 'r1';
ACTION_MAP[TILES.CONVEYOR_TURN_LEFT_UP.index] = 'u1';
ACTION_MAP[TILES.CONVEYOR_UP.index] = 'u1';
ACTION_MAP[TILES.CONVEYOR_FAST_RIGHT_UP.index] = 'u2';
ACTION_MAP[TILES.CONVEYOR_FAST_DOWN_RIGHT.index] = 'r2';
ACTION_MAP[TILES.CONVEYOR_FAST_UP_LEFT.index] = 'l2';
ACTION_MAP[TILES.CONVEYOR_FAST_LEFT_DOWN.index] = 'd2';
ACTION_MAP[TILES.CONVEYOR_RIGHT_UP.index] = 'u1';
ACTION_MAP[TILES.CONVEYOR_DOWN_RIGHT.index] = 'r1';
ACTION_MAP[TILES.CONVEYOR_UP_LEFT.index] = 'l1';
ACTION_MAP[TILES.CONVEYOR_LEFT_DOWN.index] = 'd1';
ACTION_MAP[TILES.ROTATE_ONCE_CCW.index] = 'w1';
ACTION_MAP[TILES.ROTATE_ONCE_CW.index] = 'c1';
ACTION_MAP[TILES.ROTATE_TWICE_CCW.index] = 'w2';
ACTION_MAP[TILES.ROTATE_TWICE_CW.index] = 'c2';
    
// fixme: this is duplicated (basically) in main.js, also it's inefficient to do it this way
function getTileAtPosition(position) {
    var x = position[0], y = exports.frog_swamp.length - position[1] - 1;
    var tileCode = exports.frog_swamp[y].split(/ +/)[x];
    for(var key in TILES) {
        if (TILES[key].code === tileCode)
            return TILES[key];
    }
}

function tileContainsRobot(position, bots) {
    for (var i = 0; i < bots.length; i++) {
        var bot = bots[i];
        if (bot.position[0] === position[0] && bot.position[1] === position[1])
            return true;
    }
    return false;
}

/*function getEnemyBots(client) {
    var enemyBots = [];
    for (var c in client.room.clients) {
        if (c == client)
            continue
        enemyBots.push(c.bot);
    }
    return enemyBots;
}*/

exports.canMoveForward = function(client) {
    var bot = client.bot;
    var tile = getTileAtPosition(bot.position);
    
    var collisions = DIRECTION_COLLISION_MAP[bot.direction.name];
    if (tile.index == collisions[0].index)
        return false;

    // check the tile we'd be entering
    var nextPos = bot.move('move');
    
    if (tileContainsRobot(nextPos, client.getEnemyBots()))
        return false;
    
    // off the board?
    if (nextPos[0] < 0 || nextPos[0] >= exports.frog_swamp[0].length
            || nextPos[1] < 0 || nextPos[1] >= exports.frog_swamp.length)
        return false;
    
    tile = getTileAtPosition(nextPos);
    if (tile.index === collisions[1].index)
        return false;
        
    return true;
};

exports.canMoveBackward = function(client) {
    var bot = client.bot;
    var tile = getTileAtPosition(bot.position);
    var collisions = DIRECTION_COLLISION_MAP[bot.direction.name];
    if (tile.index == collisions[1].index)
        return false;

    // check the tile we'd be entering
    var nextPos = bot.move('reverse');

    if (tileContainsRobot(nextPos, client.getEnemyBots()))
        return false;

    // off the board?
    if (nextPos[0] < 0 || nextPos[0] >= exports.frog_swamp[0].length
            || nextPos[1] < 0 || nextPos[1] >= exports.frog_swamp.length)
        return false;

    tile = getTileAtPosition(nextPos);
    if (tile.index === collisions[0].index)
        return false;
        
    return true;
};

// this method is for when tiles need to move a bot, not for when a bot moves as the result of
// a register/user action (since tiles don't observe the bot's usual direction)
function moveBot(client, direction, reps) {
    var bot = client.bot;
    var oldDirection = bot.direction;
    bot.direction = direction;
    for (var i = 0; i < reps; i++) {
        if (!exports.canMoveForward(client))
            break;
        bot.forwards();
        client.room.checkFlag(client);
    }
    bot.direction = oldDirection;
}

exports.execTileMotion = function(client) {
    var bot = client.bot;
    var tile = getTileAtPosition(bot.position);
    var motion = ACTION_MAP[tile.index];

    if (!motion)
        return;

    var reps = Number(motion[1]);
    switch(motion[0]) {
        case 'u':
            moveBot(client, dir.north, reps);
            break;
        case 'd':
            moveBot(client, dir.south, reps);
            break;
        case 'r':
            moveBot(client, dir.east, reps);
            break;
        case 'l':
            moveBot(client, dir.west, reps);
            break;            
        case 'c':
            for (var i = 0; i < reps; i++)
                bot.rotate_cw();
            break;
        case 'w':
            for (var i = 0; i < reps; i++)
                bot.rotate_ccw();
            break;
    };
    
};
