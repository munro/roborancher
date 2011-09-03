var Map = require('./Map'),
    maps = require('./maps'),
    Tile = require('./Tile'),
    Bot = require('./Bot'),
    Card = require('./Card'),
    Vector = require('./Vector');

// first item is the collision on the current tile, second is the collision on the tile
// we would be entering.
var DIRECTION_COLLISION_MAP = {
    'UP': [ Tile.TILES.WALL_TOP, Tile.TILES.WALL_BOTTOM ],
    'DOWN': [ Tile.TILES.WALL_BOTTOM, Tile.TILES.WALL_TOP ],
    'LEFT': [ Tile.TILES.WALL_LEFT, Tile.TILES.WALL_RIGHT ],
    'RIGHT': [ Tile.TILES.WALL_RIGHT, Tile.TILES.WALL_LEFT ]
};

function World(map, numPlayers) {
    this.map = map;
    this.numPlayers = numPlayers;
    
    this.reset();
}

World.EVENTS = {
    FLAG_CAPTURED: 1,
    GAME_OVER: 2
};

World.prototype.reset = function() {
    var startingPositions = this.map.getStartingPositionsFor(this.numPlayers);
    
    this.bots = [];
    for (var i = 0; i < this.numPlayers; i++) {
        var position = startingPositions[i]['position'];
        var direction = startingPositions[i]['direction'];
        this.bots.push(new Bot(position, direction));
    }
    
    this.visibleFlags = [];
    for (var i = 0; i < this.map.flagPositions.length; i++) 
        this.visibleFlags.push(i);
        
    this.events = [];
};

// note: player number is 0-indexed
World.prototype.botForPlayer = function(player) {
    if (player < 0 || player >= this.numPlayers)
        throw 'Player number is invalid: ' + player
    return this.bots[player];
};

World.prototype.canMove = function(bot, direction) {
    var collisions = DIRECTION_COLLISION_MAP[direction.getDirectionName()];
    if (!collisions)
        throw JSON.stringify(direction) + ' is not an expected direction.';
        
    // is there a wall on the current tile in the direction we're going?
    if (this.map.tileAt(bot.position.x, bot.position.y) === collisions[0])
        return false;
    
    // is the new position off the map?
    var newPosition = bot.position.add(direction);
    if (!this.map.positionIsOnMap(newPosition))
        return false;

    // is there a bot where we're trying to move?
    for (var i = 0; i < this.bots.length; i++)
        if (this.bots[i] != bot && this.bots[i].position.equals(newPosition))
            return false;
    
    // is there a wall on the destination tile preventing us from entering?
    if (this.map.tileAt(newPosition.x, newPosition.y) === collisions[1])
        return false;
        
    return true;
};

World.prototype.getVisibleFlagAtPosition = function(position) {
    var flag = this.map.getFlagAtPosition(position);
    if (flag !== undefined && this.visibleFlags.indexOf(flag) !== undefined)
        return flag;
    return undefined;
};

World.prototype.captureFlag = function(bot, flag) {
    this.visibleFlags.splice(this.visibleFlags.indexOf(flag), 1);
    bot.flags += 1;
    this.events.splice(0, 0, World.EVENTS.FLAG_CAPTURED);
    if (this.visibleFlags.length === 0) {
        bot.won = true;
        this.events.splice(0, 0, World.EVENTS.GAME_OVER);
    }
};

World.prototype.hasEvents = function() {
    return this.events.length != 0;
};

World.prototype.popEvent = function() {
    return this.events.pop();
};

World.prototype.moveBot = function(bot, direction) {
    if (this.canMove(bot, direction)) {
        bot.move(direction);
        var flag = this.getVisibleFlagAtPosition(bot.position);
        if (flag !== undefined)
            this.captureFlag(bot, flag);
    }        
};

World.prototype.execCard = function(player, card) {
    bot = this.botForPlayer(player);

    var tile = this.map.tileAt(bot.position.x, bot.position.y);
        
    switch (card.id) {
    case Card.CARD_TYPES.FORWARD:
        this.moveBot(bot, bot.direction);
        break;
    case Card.CARD_TYPES.FORWARD_2:
        this.moveBot(bot, bot.direction);
        this.moveBot(bot, bot.direction);
        break;
    case Card.CARD_TYPES.BACKWARD:
        this.moveBot(bot, bot.direction.rotate180());
        break;
    case Card.CARD_TYPES.BACKWARD_2:
        this.moveBot(bot, bot.direction.rotate180());
        this.moveBot(bot, bot.direction.rotate180());
        break;
    case Card.CARD_TYPES.ROTATE_90_CW:
        bot.rotate90CW();
        break;
    case Card.CARD_TYPES.ROTATE_90_CCW:
        bot.rotate90CCW();
        break;
    case Card.CARD_TYPES.ROTATE_180:
        bot.rotate180();
        break;
    default:
        throw 'Unsupported card: ' + card.name
    }
};

World.prototype.execTileActions = function(player) {
    var bot = this.botForPlayer(player);

    var tile = this.map.tileAt(bot.position.x, bot.position.y);    
    if (!tile.actionCode)
        return; // no actions for this tile

    var reps = Number(tile.actionCode[1]);
    var direction = undefined;
    var rotate = undefined;
    switch(tile.actionCode[0]) {
        case 'u':            
            direction = Vector.DIRECTIONS.UP;
            break;
        case 'd':
            direction = Vector.DIRECTIONS.DOWN;
            break;
        case 'r':
            direction = Vector.DIRECTIONS.RIGHT;
            break;
        case 'l':
            direction = Vector.DIRECTIONS.LEFT;
            break;            
        case 'c':
            rotate = bot.rotate90CW;
            break;
        case 'w':
            rotate = bot.rotate90CCW;
            break;
    };
    
    for (var i = 0; i < reps; i++) {
        if (direction)
            this.moveBot(bot, direction);
        if (rotate)
            rotate.call(bot);
    }
};

module.exports = World;

if (require.main === module) {
    // tests
    // /*
    var w = new World(Map.fromDefinition(maps.FROG_SWAMP), 1);

    DEFINITION = {
        name: 'test3',
        bots: [ [ [ [ 0, 0 ], 'UP' ] ] ], 
        tiles: [
            '. wl wl',
            '. wb  .',
            '. wb  .',
            '.  .  .',
        ]
    }
    var map = Map.fromDefinition(DEFINITION);
    var w = new World(map, 1);
    var b = new Bot();
    b.position = new Vector(1, 1);
    if (w.canMove(b, Vector.DIRECTIONS.UP))
        dang;
    if (w.canMove(b, Vector.DIRECTIONS.DOWN))
        dang;
    b.position = new Vector(1, 3);
    if (w.canMove(b, Vector.DIRECTIONS.RIGHT))
        dang;
    if (w.canMove(b, Vector.DIRECTIONS.LEFT))
        dang;
    b.position = new Vector(0, 0);
    if (w.canMove(b, Vector.DIRECTIONS.LEFT))
        dang;
    if (w.canMove(b, Vector.DIRECTIONS.LEFT))
        dang;
    if (w.canMove(b, Vector.DIRECTIONS.DOWN))
        dang;
    b.position = new Vector(2, 3);
    if (w.canMove(b, Vector.DIRECTIONS.UP))
        dang;
    if (w.canMove(b, Vector.DIRECTIONS.RIGHT))
        dang;
    if (w.canMove(b, Vector.DIRECTIONS.LEFT))
        dang;
    b.position = new Vector(0, 0);
    if (!w.canMove(b, Vector.DIRECTIONS.RIGHT))
        dang;
    b.position = new Vector(0, 3);
    if (w.canMove(b, Vector.DIRECTIONS.RIGHT))
        dang;
    if (!w.canMove(b, Vector.DIRECTIONS.DOWN))
        dang;
    b.position = new Vector(0, 0);
    if (!w.canMove(b, Vector.DIRECTIONS.UP))
        dang;
    w.bots[0].position = new Vector(0, 1);
    if (w.canMove(b, Vector.DIRECTIONS.UP))
        dang;

    DEFINITION = {
        name: 'test4',
        bots: [ [ [ [ 0, 0 ], 'UP' ] ] ], 
        tiles: [
            '. . . . .',
            '. . . . .',
            '. . . . .',
            '. . . . .',
            '. . . . .'
        ]
    }
    var map = Map.fromDefinition(DEFINITION);
    var w = new World(map, 1);
    w.bots[0].position = new Vector(2, 2);
    map.rows[2][2] = Tile.TILES.CONVEYOR_UP;
    w.execTileActions(0);
    if (!w.bots[0].position.equals(new Vector(2, 3)))
        dang;

    w.bots[0].position = new Vector(2, 2);
    map.rows[2][2] = Tile.TILES.CONVEYOR_DOWN;
    w.execTileActions(0);
    if (!w.bots[0].position.equals(new Vector(2, 1)))
        dang;

    w.bots[0].position = new Vector(2, 2);
    map.rows[2][2] = Tile.TILES.CONVEYOR_FAST_LEFT;
    w.execTileActions(0);
    if (!w.bots[0].position.equals(new Vector(0, 2)))
        dang;

    w.bots[0].position = new Vector(2, 2);
    map.rows[2][2] = Tile.TILES.CONVEYOR_FAST_RIGHT_UP;
    w.execTileActions(0);
    if (!w.bots[0].position.equals(new Vector(2, 4)))
        dang;

    w.bots[0].position = new Vector(2, 2);
    w.bots[0].direction = Vector.DIRECTIONS.UP;
    map.rows[2][2] = Tile.TILES.ROTATE_ONCE_CW;
    w.execTileActions(0);
    if (!w.bots[0].direction.equals(Vector.DIRECTIONS.RIGHT))
        dang;

    w.bots[0].direction = Vector.DIRECTIONS.UP;
    map.rows[2][2] = Tile.TILES.ROTATE_TWICE_CW;
    w.execTileActions(0);
    if (!w.bots[0].direction.equals(Vector.DIRECTIONS.DOWN))
        dang;

    w.bots[0].direction = Vector.DIRECTIONS.UP;
    map.rows[2][2] = Tile.TILES.ROTATE_ONCE_CCW;
    w.execTileActions(0);
    if (!w.bots[0].direction.equals(Vector.DIRECTIONS.LEFT))
        dang;

    w.bots[0].direction = Vector.DIRECTIONS.UP;
    map.rows[2][2] = Tile.TILES.ROTATE_TWICE_CCW;
    w.execTileActions(0);
    if (!w.bots[0].direction.equals(Vector.DIRECTIONS.DOWN))
        dang;
        
    // test cards
    DEFINITION = {
        name: 'test_cards',
        bots: [ [ [ [ 0, 0 ], 'UP' ] ] ], 
        tiles: [
            '.  .  .',
            '.  f  f',
            '.  .  .',
            '.  .  .',
        ]
    }
    var map = Map.fromDefinition(DEFINITION);
    var w = new World(map, 1);
    var bot = w.botForPlayer(0);
    w.execCard(0, new Card(Card.CARD_TYPES.FORWARD));
    if (bot.position.x != 0 || bot.position.y != 1)
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.BACKWARD));
    if (bot.position.x != 0 || bot.position.y != 0)
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.BACKWARD));
    if (bot.position.x != 0 || bot.position.y != 0)
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.FORWARD_2));
    if (bot.position.x != 0 || bot.position.y != 2)
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.ROTATE_180));
    if (!bot.direction.equals(Vector.DIRECTIONS.DOWN))
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.ROTATE_180));
    if (!bot.direction.equals(Vector.DIRECTIONS.UP))
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.ROTATE_90_CW));
    if (!bot.direction.equals(Vector.DIRECTIONS.RIGHT))
        dang;

    // get a flag
    if (w.hasEvents())
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.FORWARD));
    if (!w.hasEvents())
        dang;
    if (w.popEvent() != World.EVENTS.FLAG_CAPTURED)
        dang;
    if (bot.flags != 1)
        dang;
    if (w.hasEvents())
        dang;
    w.execCard(0, new Card(Card.CARD_TYPES.FORWARD));
    if (!w.hasEvents())
        dang;
    if (w.popEvent() != World.EVENTS.FLAG_CAPTURED)
        dang;
    if (w.popEvent() != World.EVENTS.GAME_OVER)
        dang;
    if (bot.flags != 2)
        dang;
    if (bot.won != true)
        dang;
    // */
}
